import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthStrategy, LoginDto } from '../dto/login.dto';

export interface ILoginValidator {
  validate(loginDto: LoginDto): Promise<void>;
}

@Injectable()
export class LoginValidator implements ILoginValidator {
  async validate(loginDto: LoginDto): Promise<void> {
    const { auth_strategy, email, username, password, otp, token, code, mobile_no, mobile_country_code } = loginDto;

    switch (auth_strategy) {
      case AuthStrategy.PASSWORD_OTP:
        await this.validatePasswordOtp(email, username, password, otp, mobile_no, mobile_country_code);
        break;

      case AuthStrategy.AZURE_B2C:
      case AuthStrategy.KEYCLOAK:
      case AuthStrategy.GOOGLE:
      case AuthStrategy.APPLE:
        await this.validateOAuth(token, code);
        break;

      default:
        throw new BadRequestException(`Unsupported authentication strategy: ${auth_strategy}`);
    }

    // Validate device info
    await this.validateDeviceInfo(loginDto.device_info);
  }

  private async validatePasswordOtp(
    email?: string,
    username?: string,
    password?: string,
    otp?: string,
    mobile_no?: string,
    mobile_country_code?: string,
  ): Promise<void> {
    // Must have either email or username
    if (!email && !username) {
      throw new BadRequestException('Either email or username is required for password authentication');
    }

    // Must have password
    if (!password) {
      throw new BadRequestException('Password is required for password authentication');
    }

    // If OTP is part of strategy, validate mobile number
    if (otp && (!mobile_no || !mobile_country_code)) {
      throw new BadRequestException('Mobile number and country code are required for OTP authentication');
    }

    // Validate email format if provided
    if (email && !this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (password && password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Validate OTP format if provided
    if (otp && (otp.length < 4 || otp.length > 8)) {
      throw new BadRequestException('Invalid OTP format');
    }
  }

  private async validateOAuth(token?: string, code?: string): Promise<void> {
    if (!token && !code) {
      throw new BadRequestException('Either token or authorization code is required for OAuth authentication');
    }
  }

  private async validateDeviceInfo(deviceInfo: any): Promise<void> {
    if (!deviceInfo) {
      throw new BadRequestException('Device information is required');
    }

    if (!deviceInfo.device_type) {
      throw new BadRequestException('Device type is required');
    }

    if (!deviceInfo.device_id) {
      throw new BadRequestException('Device ID is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
