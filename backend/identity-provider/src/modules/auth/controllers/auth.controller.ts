import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LogoutDto } from '../dto/logout.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() request: Request): Promise<LoginResponseDto> {
    const correlationId = (request as any).correlationId || 'no-correlation-id';

    // Enrich device info with request data
    if (!loginDto.device_info.ip_address) {
      loginDto.device_info.ip_address =
        (request.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        request.socket.remoteAddress ||
        '0.0.0.0';
    }

    if (!loginDto.device_info.user_agent) {
      loginDto.device_info.user_agent = request.headers['user-agent'] || '';
    }

    return await this.authService.login(loginDto, correlationId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Body() logoutDto: LogoutDto,
    @Req() request: Request,
  ): Promise<void> {
    const correlationId = (request as any).correlationId || 'no-correlation-id';
    const userId = (request as any).user?.id; // From JWT guard

    await this.authService.logout(logoutDto.session_id, userId, correlationId, logoutDto.reason);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body('refresh_token') refreshToken: string,
    @Req() request: Request,
  ): Promise<{ access_token: string; expires_in: number }> {
    const correlationId = (request as any).correlationId || 'no-correlation-id';

    return await this.authService.refreshToken(refreshToken, correlationId);
  }

  @Get('me')
  async getCurrentUser(@Req() request: Request): Promise<any> {
    // This would be protected by JWT guard
    return (request as any).user;
  }
}
