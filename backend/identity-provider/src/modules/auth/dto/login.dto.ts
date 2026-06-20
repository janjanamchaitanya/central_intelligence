import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, MinLength, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum AuthStrategy {
  PASSWORD_OTP = 'password_otp',
  AZURE_B2C = 'azure_b2c',
  KEYCLOAK = 'keycloak',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum DeviceType {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}

export class DeviceInfoDto {
  @IsEnum(DeviceType)
  @IsNotEmpty()
  device_type: DeviceType;

  @IsString()
  @IsNotEmpty()
  device_id: string;

  @IsString()
  @IsOptional()
  device_name?: string;

  @IsString()
  @IsOptional()
  os_version?: string;

  @IsString()
  @IsOptional()
  app_version?: string;

  @IsString()
  @IsOptional()
  browser?: string;

  @IsString()
  @IsOptional()
  browser_version?: string;

  @IsString()
  @IsOptional()
  user_agent?: string;

  @IsString()
  @IsOptional()
  ip_address?: string;

  @IsObject()
  @IsOptional()
  screen_resolution?: {
    width: number;
    height: number;
  };

  @IsObject()
  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

export class LoginDto {
  @IsEnum(AuthStrategy)
  @IsNotEmpty()
  auth_strategy: AuthStrategy;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  otp?: string;

  @IsString()
  @IsOptional()
  token?: string; // For OAuth/OIDC tokens

  @IsString()
  @IsOptional()
  code?: string; // For OAuth authorization codes

  @IsString()
  @IsOptional()
  mobile_no?: string;

  @IsString()
  @IsOptional()
  mobile_country_code?: string;

  @ValidateNested()
  @Type(() => DeviceInfoDto)
  @IsNotEmpty()
  device_info: DeviceInfoDto;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
