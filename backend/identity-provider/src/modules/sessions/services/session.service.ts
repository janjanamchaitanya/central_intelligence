import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Session } from '../../../database/models/session.model';
import { User } from '../../../database/models/user.model';
import { UserDevice } from '../../../database/models/user-device.model';
import { DeviceInfoDto } from '../../auth/dto/login.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import * as crypto from 'crypto';

export interface SessionCreateData {
  user: User;
  device: UserDevice;
  deviceInfo: DeviceInfoDto;
  metadata?: Record<string, any>;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'dev-secret-key';
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
    this.refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';
  }

  async createSession(data: SessionCreateData): Promise<{ session: Session; tokens: TokenPair }> {
    const { user, device, deviceInfo, metadata } = data;

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    const tokenHash = this.hashToken(refreshToken);

    // Calculate session expiration
    const expiresAt = this.calculateExpiration(this.refreshTokenExpiresIn);

    // Create session
    const session = await Session.query().insert({
      user_id: user.id,
      device_id: device.id,
      session_token: tokenHash,
      refresh_token: tokenHash,
      ip_address: deviceInfo.ip_address || '0.0.0.0',
      user_agent: deviceInfo.user_agent || '',
      device_type: deviceInfo.device_type,
      browser: deviceInfo.browser,
      browser_version: deviceInfo.browser_version,
      os_type: device.os_type,
      os_version: deviceInfo.os_version,
      city: deviceInfo.location?.city,
      country: deviceInfo.location?.country || user.country,
      is_active: true,
      expires_at: expiresAt,
      metadata,
      // Required fields from original schema
      session_hash: tokenHash,
      auth_method: 'password',
      login_flow: deviceInfo.device_type === 'web' ? 'web' : 'mobile',
      is_authenticated: true,
      timezone: 'UTC',
      suspicious: false,
      login_at: new Date(),
      correlation_id: crypto.randomBytes(16).toString('hex'),
      status: 'active',
    });

    this.logger.log(`Session created for user ${user.id}: ${session.id}`);

    const tokens: TokenPair = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.getExpirationSeconds(this.jwtExpiresIn),
    };

    return { session, tokens };
  }

  async findSession(sessionId: string): Promise<Session | null> {
    const session = await Session.query()
      .findById(sessionId)
      .whereNull('deleted_at')
      .withGraphFetched('[user, device]');

    return session || null;
  }

  async findUserSessions(userId: string, includeInactive = false): Promise<Session[]> {
    let query = Session.query()
      .where('user_id', userId)
      .whereNull('deleted_at')
      .withGraphFetched('[device]')
      .orderBy('last_active_at', 'desc');

    if (!includeInactive) {
      query = query.where('is_active', true);
    }

    return await query;
  }

  async updateSessionActivity(sessionId: string, ipAddress: string): Promise<void> {
    await Session.query()
      .findById(sessionId)
      .patch({
        last_active_at: new Date(),
        ip_address: ipAddress,
      });
  }

  async endSession(sessionId: string, userId: string, reason?: string): Promise<void> {
    const session = await Session.query()
      .findById(sessionId)
      .where('user_id', userId)
      .whereNull('deleted_at')
      .first();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await session.$query().patch({
      is_active: false,
      ended_at: new Date(),
      metadata: {
        ...session.metadata,
        end_reason: reason || 'user_logout',
      },
    });

    this.logger.log(`Session ${sessionId} ended for user ${userId}. Reason: ${reason || 'user_logout'}`);
  }

  async endAllUserSessions(userId: string, exceptSessionId?: string, reason?: string): Promise<number> {
    let query = Session.query()
      .where('user_id', userId)
      .where('is_active', true)
      .whereNull('deleted_at');

    if (exceptSessionId) {
      query = query.whereNot('id', exceptSessionId);
    }

    const patchData: any = {
      is_active: false,
      ended_at: new Date(),
    };

    const count = await query.patch(patchData);

    this.logger.log(`Ended ${count} sessions for user ${userId}. Reason: ${reason || 'logout_all'}`);

    return count;
  }

  async validateSession(sessionId: string): Promise<Session> {
    const session = await this.findSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (!session.is_active) {
      throw new UnauthorizedException('Session is inactive');
    }

    // Check if session expired
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      await session.$query().patch({ is_active: false });
      throw new UnauthorizedException('Session expired');
    }

    return session;
  }

  async refreshSession(refreshToken: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(refreshToken);

    const session = await Session.query()
      .where('refresh_token', tokenHash)
      .where('is_active', true)
      .whereNull('deleted_at')
      .withGraphFetched('user')
      .first();

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session expired
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      await session.$query().patch({ is_active: false });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(session.user);

    // Update session activity
    await session.$query().patch({
      last_active_at: new Date(),
    });

    this.logger.log(`Session refreshed: ${session.id}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.getExpirationSeconds(this.jwtExpiresIn),
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      type: 'access',
    };

    const options = {
      expiresIn: this.jwtExpiresIn,
    } as SignOptions;

    return sign(payload, this.jwtSecret, options);
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
      type: 'refresh',
      jti: crypto.randomBytes(16).toString('hex'),
    };

    const options = {
      expiresIn: this.refreshTokenExpiresIn,
    } as SignOptions;

    return sign(payload, this.jwtSecret, options);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiration(duration: string): Date {
    const seconds = this.getExpirationSeconds(duration);
    return new Date(Date.now() + seconds * 1000);
  }

  private getExpirationSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        throw new Error(`Invalid duration unit: ${unit}`);
    }
  }
}
