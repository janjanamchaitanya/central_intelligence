import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { IAuthStrategy, AuthResult } from '../interfaces/auth-strategy.interface';
import { LoginDto } from '../dto/login.dto';
import { User, UserStatus } from '../../../database/models/user.model';

@Injectable()
export class AzureB2CStrategy implements IAuthStrategy {
  private readonly logger = new Logger(AzureB2CStrategy.name);

  async authenticate(loginDto: LoginDto): Promise<AuthResult> {
    const { token, code } = loginDto;

    // Validate Azure B2C token or exchange code for token
    const azureUser = token
      ? await this.validateToken(token)
      : await this.exchangeCodeForToken(code!);

    if (!azureUser) {
      throw new UnauthorizedException('Invalid Azure B2C token');
    }

    // Find or create user
    let user = await this.findUserByExternalId(azureUser.id);

    if (!user) {
      user = await this.createUserFromAzure(azureUser);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    this.logger.log(`User ${user.id} authenticated successfully via Azure B2C`);

    return {
      user,
      requires_2fa: false,
      metadata: {
        azure_user_id: azureUser.id,
        azure_tenant_id: azureUser.tenantId,
      },
    };
  }

  async validateCredentials(credentials: { token: string }): Promise<boolean> {
    const azureUser = await this.validateToken(credentials.token);
    return !!azureUser;
  }

  private async validateToken(token: string): Promise<any | null> {
    // TODO: Implement Azure B2C token validation
    // This would use Microsoft Graph API or Azure AD libraries
    // const client = new ConfidentialClientApplication(config);
    // const result = await client.acquireTokenByCode({ code, scopes });

    this.logger.log('Validating Azure B2C token');

    // Mock implementation
    return {
      id: 'azure_user_123',
      tenantId: 'tenant_123',
      email: 'user@example.com',
      name: 'Azure User',
      givenName: 'Azure',
      surname: 'User',
    };
  }

  private async exchangeCodeForToken(code: string): Promise<any | null> {
    // TODO: Exchange authorization code for access token
    this.logger.log('Exchanging Azure B2C authorization code for token');

    // Mock implementation
    return {
      id: 'azure_user_123',
      tenantId: 'tenant_123',
      email: 'user@example.com',
      name: 'Azure User',
      givenName: 'Azure',
      surname: 'User',
    };
  }

  private async findUserByExternalId(externalId: string): Promise<User | null> {
    const user = await User.query()
      .where('external_idp_id', externalId)
      .where('idp_id', 'azure_b2c')
      .whereNull('deleted_at')
      .first();

    return user || null;
  }

  private async createUserFromAzure(azureUser: any): Promise<User> {
    // Create new user from Azure B2C data
    const user = await User.query().insert({
      email: azureUser.email,
      username: azureUser.email,
      first_name: azureUser.givenName || 'Unknown',
      last_name: azureUser.surname || 'Unknown',
      idp_id: 'azure_b2c',
      external_idp_id: azureUser.id,
      country: 'US', // Default, should be determined from Azure
      currency: 'USD', // Default, should be determined
      status: UserStatus.ACTIVE,
      is_active: true,
      tfa: false,
      password_digest: '', // No password for OAuth users
      mobile_no: '',
      mobile_country_code: '',
    });

    this.logger.log(`Created new user ${user.id} from Azure B2C`);
    return user;
  }
}
