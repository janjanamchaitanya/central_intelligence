import { Injectable, BadRequestException } from '@nestjs/common';
import { IAuthStrategy } from '../interfaces/auth-strategy.interface';
import { AuthStrategy } from '../dto/login.dto';
import { PasswordOtpStrategy } from './password-otp.strategy';
import { AzureB2CStrategy } from './azure-b2c.strategy';
import { KeycloakStrategy } from './keycloak.strategy';

@Injectable()
export class AuthStrategyFactory {
  constructor(
    private readonly passwordOtpStrategy: PasswordOtpStrategy,
    private readonly azureB2CStrategy: AzureB2CStrategy,
    private readonly keycloakStrategy: KeycloakStrategy,
  ) {}

  getStrategy(authStrategy: AuthStrategy): IAuthStrategy {
    switch (authStrategy) {
      case AuthStrategy.PASSWORD_OTP:
        return this.passwordOtpStrategy;

      case AuthStrategy.AZURE_B2C:
        return this.azureB2CStrategy;

      case AuthStrategy.KEYCLOAK:
        return this.keycloakStrategy;

      case AuthStrategy.GOOGLE:
      case AuthStrategy.APPLE:
        // TODO: Implement Google and Apple strategies
        throw new BadRequestException(`${authStrategy} authentication not yet implemented`);

      default:
        throw new BadRequestException(`Unsupported authentication strategy: ${authStrategy}`);
    }
  }
}
