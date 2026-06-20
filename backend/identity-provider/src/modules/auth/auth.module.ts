import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LoginValidator } from './validators/login.validator';
import { PasswordOtpStrategy } from './strategies/password-otp.strategy';
import { AzureB2CStrategy } from './strategies/azure-b2c.strategy';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { AuthStrategyFactory } from './strategies/auth-strategy.factory';
import { WebDeviceStrategy } from './strategies/device-binding/web-device.strategy';
import { MobileDeviceStrategy } from './strategies/device-binding/mobile-device.strategy';
import { DeviceBindingFactory } from './strategies/device-binding/device-binding.factory';
import { SessionsModule } from '../sessions/sessions.module';
import { EventPublisherService } from '../../common/events/event-publisher.service';

@Module({
  imports: [SessionsModule],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    EventPublisherService,

    // Validators
    LoginValidator,

    // Auth Strategies
    PasswordOtpStrategy,
    AzureB2CStrategy,
    KeycloakStrategy,
    AuthStrategyFactory,

    // Device Binding Strategies
    WebDeviceStrategy,
    MobileDeviceStrategy,
    DeviceBindingFactory,
  ],
  exports: [AuthService],
})
export class AuthModule {}
