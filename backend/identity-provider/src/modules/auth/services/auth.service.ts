import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginValidator } from '../validators/login.validator';
import { AuthStrategyFactory } from '../strategies/auth-strategy.factory';
import { DeviceBindingFactory } from '../strategies/device-binding/device-binding.factory';
import { SessionService } from '../../sessions/services/session.service';
import { SessionActivityService } from '../../sessions/services/session-activity.service';
import { EventPublisherService } from '../../../common/events/event-publisher.service';
import { InvalidCredentialsException, TwoFactorRequiredException } from '../../../common/exceptions/auth.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly loginValidator: LoginValidator,
    private readonly authStrategyFactory: AuthStrategyFactory,
    private readonly deviceBindingFactory: DeviceBindingFactory,
    private readonly sessionService: SessionService,
    private readonly sessionActivityService: SessionActivityService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  async login(loginDto: LoginDto, correlationId: string): Promise<LoginResponseDto> {
    try {
      // Step 1: Input Validation
      await this.loginValidator.validate(loginDto);
      this.logger.log(`Login attempt for ${loginDto.email || loginDto.username} using ${loginDto.auth_strategy}`);

      // Step 2: Authentication
      const authStrategy = this.authStrategyFactory.getStrategy(loginDto.auth_strategy);
      const authResult = await authStrategy.authenticate(loginDto);

      // Step 2b: Handle 2FA requirement
      if (authResult.requires_2fa) {
        this.logger.log(`2FA required for user ${authResult.user.id}`);

        await this.eventPublisher.publishAuthEvent({
          event_type: 'auth.2fa.required' as any,
          timestamp: new Date(),
          correlation_id: correlationId,
          user_id: authResult.user.id,
          ip_address: loginDto.device_info.ip_address || '0.0.0.0',
          user_agent: loginDto.device_info.user_agent,
        });

        throw new TwoFactorRequiredException(authResult.temp_token!);
      }

      // Step 3: Device Binding
      const deviceBindingStrategy = this.deviceBindingFactory.getStrategy(loginDto.device_info.device_type);
      const deviceBindingResult = await deviceBindingStrategy.bind(
        authResult.user.id,
        loginDto.device_info,
        '', // Session ID will be set after session creation
      );

      this.logger.log(
        `Device bound for user ${authResult.user.id}: ${deviceBindingResult.device.id} (new: ${deviceBindingResult.is_new_device}, trusted: ${deviceBindingResult.is_trusted}, risk: ${deviceBindingResult.risk_score})`,
      );

      // Publish device binding event
      await this.eventPublisher.publishDeviceBound({
        correlationId,
        userId: authResult.user.id,
        deviceId: deviceBindingResult.device.id,
        deviceType: loginDto.device_info.device_type,
        isNewDevice: deviceBindingResult.is_new_device,
        isTrusted: deviceBindingResult.is_trusted,
        riskScore: deviceBindingResult.risk_score || 0,
        ipAddress: loginDto.device_info.ip_address || '0.0.0.0',
      });

      // Check for suspicious activity
      if ((deviceBindingResult.risk_score || 0) > 70) {
        await this.eventPublisher.publishSuspiciousActivity({
          correlationId,
          userId: authResult.user.id,
          activityType: 'high_risk_login',
          riskScore: deviceBindingResult.risk_score || 0,
          details: {
            is_new_device: deviceBindingResult.is_new_device,
            device_type: loginDto.device_info.device_type,
          },
          ipAddress: loginDto.device_info.ip_address || '0.0.0.0',
        });
      }

      // Step 4: Session Creation
      const { session, tokens } = await this.sessionService.createSession({
        user: authResult.user,
        device: deviceBindingResult.device,
        deviceInfo: loginDto.device_info,
        metadata: authResult.metadata,
      });

      this.logger.log(`Session created for user ${authResult.user.id}: ${session.id}`);

      // Step 5: Record Session Activity
      await this.sessionActivityService.recordLogin(
        session.id,
        loginDto.device_info.ip_address || '0.0.0.0',
        loginDto.device_info.user_agent,
      );

      // Publish login success event
      await this.eventPublisher.publishLoginSuccess({
        correlationId,
        userId: authResult.user.id,
        sessionId: session.id,
        deviceId: deviceBindingResult.device.id,
        deviceType: loginDto.device_info.device_type,
        authStrategy: loginDto.auth_strategy,
        ipAddress: loginDto.device_info.ip_address || '0.0.0.0',
        userAgent: loginDto.device_info.user_agent,
        location: loginDto.device_info.location,
      });

      // Build response
      const response: LoginResponseDto = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
        user: {
          id: authResult.user.id,
          email: authResult.user.email,
          username: authResult.user.username,
          first_name: authResult.user.first_name,
          last_name: authResult.user.last_name,
        },
        session: {
          id: session.id,
          created_at: session.created_at,
          expires_at: session.expires_at,
        },
      };

      this.logger.log(`Login successful for user ${authResult.user.id}`);
      return response;
    } catch (error) {
      // Publish login failed event
      if (!(error instanceof TwoFactorRequiredException)) {
        await this.eventPublisher.publishLoginFailed({
          correlationId,
          email: loginDto.email,
          username: loginDto.username,
          reason: error instanceof Error ? error.message : 'Unknown error',
          authStrategy: loginDto.auth_strategy,
          ipAddress: loginDto.device_info.ip_address || '0.0.0.0',
        });
      }

      throw error;
    }
  }

  async logout(sessionId: string, userId: string, correlationId: string, reason?: string): Promise<void> {
    // End session
    await this.sessionService.endSession(sessionId, userId, reason);

    // Record activity
    await this.sessionActivityService.recordLogout(sessionId, '0.0.0.0', reason);

    // Publish event
    await this.eventPublisher.publishLogout({
      correlationId,
      userId,
      sessionId,
      reason,
      ipAddress: '0.0.0.0',
    });

    this.logger.log(`Logout successful for user ${userId}, session ${sessionId}`);
  }

  async refreshToken(refreshToken: string, correlationId: string): Promise<{ access_token: string; expires_in: number }> {
    const tokens = await this.sessionService.refreshSession(refreshToken);

    await this.eventPublisher.publishAuthEvent({
      event_type: 'auth.token.refreshed' as any,
      timestamp: new Date(),
      correlation_id: correlationId,
      ip_address: '0.0.0.0',
    });

    return {
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    };
  }
}
