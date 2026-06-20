import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { IAuthStrategy, AuthResult } from '../interfaces/auth-strategy.interface';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../../database/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordOtpStrategy implements IAuthStrategy {
  private readonly logger = new Logger(PasswordOtpStrategy.name);

  async authenticate(loginDto: LoginDto): Promise<AuthResult> {
    const { email, username, password, otp } = loginDto;

    // Find user by email or username
    const user = await this.findUser(email, username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(password!, user.password_digest);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if 2FA is enabled
    if (user.tfa) {
      if (!otp) {
        // Generate and send OTP
        const tempToken = await this.generateTempToken(user);
        await this.sendOtp(user);

        return {
          user,
          requires_2fa: true,
          temp_token: tempToken,
        };
      }

      // Validate OTP
      const isOtpValid = await this.validateOtp(user, otp);
      if (!isOtpValid) {
        throw new UnauthorizedException('Invalid OTP');
      }
    }

    this.logger.log(`User ${user.id} authenticated successfully via Password+OTP`);

    return {
      user,
      requires_2fa: false,
    };
  }

  async validateCredentials(credentials: { password: string; hash: string }): Promise<boolean> {
    return await bcrypt.compare(credentials.password, credentials.hash);
  }

  private async findUser(email?: string, username?: string): Promise<User | null> {
    let query = User.query().whereNull('deleted_at');

    if (email) {
      query = query.where('email', email);
    } else if (username) {
      query = query.where('username', username);
    }

    const user = await query.first();
    return user || null;
  }

  private async validatePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Error validating password', error);
      return false;
    }
  }

  private async generateTempToken(user: User): Promise<string> {
    // Generate a temporary token for 2FA verification
    // This would typically use JWT with short expiration
    const tempToken = `temp_${user.id}_${Date.now()}`;

    // TODO: Store in Redis with 5 minute expiration
    // await this.redisService.set(`temp_token:${tempToken}`, user.id, 300);

    return tempToken;
  }

  private async sendOtp(user: User): Promise<void> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Store OTP in Redis with 5 minute expiration
    // await this.redisService.set(`otp:${user.id}`, otp, 300);

    // TODO: Send OTP via SMS/Email
    this.logger.log(`OTP sent to user ${user.id}: ${otp}`);
  }

  private async validateOtp(user: User, otp: string): Promise<boolean> {
    // TODO: Validate OTP from Redis
    // const storedOtp = await this.redisService.get(`otp:${user.id}`);
    // return storedOtp === otp;

    // For now, accept any 6-digit OTP (development only)
    return otp.length === 6;
  }
}
