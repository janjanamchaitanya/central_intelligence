import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { IAuthStrategy, AuthResult } from '../interfaces/auth-strategy.interface';
import { LoginDto } from '../dto/login.dto';
import { User, UserStatus } from '../../../database/models/user.model';

@Injectable()
export class KeycloakStrategy implements IAuthStrategy {
  private readonly logger = new Logger(KeycloakStrategy.name);

  async authenticate(loginDto: LoginDto): Promise<AuthResult> {
    const { token, code } = loginDto;

    // Validate Keycloak token or exchange code for token
    const keycloakUser = token
      ? await this.validateToken(token)
      : await this.exchangeCodeForToken(code!);

    if (!keycloakUser) {
      throw new UnauthorizedException('Invalid Keycloak token');
    }

    // Find or create user
    let user = await this.findUserByExternalId(keycloakUser.sub);

    if (!user) {
      user = await this.createUserFromKeycloak(keycloakUser);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    this.logger.log(`User ${user.id} authenticated successfully via Keycloak`);

    return {
      user,
      requires_2fa: false,
      metadata: {
        keycloak_user_id: keycloakUser.sub,
        keycloak_realm: keycloakUser.realm,
      },
    };
  }

  async validateCredentials(credentials: { token: string }): Promise<boolean> {
    const keycloakUser = await this.validateToken(credentials.token);
    return !!keycloakUser;
  }

  private async validateToken(token: string): Promise<any | null> {
    // TODO: Implement Keycloak token validation
    // This would use Keycloak Admin Client or direct API calls
    // const keycloakAdmin = new KcAdminClient();
    // await keycloakAdmin.auth({ ... });
    // const userInfo = await keycloakAdmin.users.findOne({ id });

    this.logger.log('Validating Keycloak token');

    // Mock implementation
    return {
      sub: 'keycloak_user_123',
      realm: 'master',
      email: 'user@example.com',
      given_name: 'Keycloak',
      family_name: 'User',
      preferred_username: 'keycloak.user',
    };
  }

  private async exchangeCodeForToken(code: string): Promise<any | null> {
    // TODO: Exchange authorization code for access token
    this.logger.log('Exchanging Keycloak authorization code for token');

    // Mock implementation
    return {
      sub: 'keycloak_user_123',
      realm: 'master',
      email: 'user@example.com',
      given_name: 'Keycloak',
      family_name: 'User',
      preferred_username: 'keycloak.user',
    };
  }

  private async findUserByExternalId(externalId: string): Promise<User | null> {
    const user = await User.query()
      .where('external_idp_id', externalId)
      .where('idp_id', 'keycloak')
      .whereNull('deleted_at')
      .first();

    return user || null;
  }

  private async createUserFromKeycloak(keycloakUser: any): Promise<User> {
    // Create new user from Keycloak data
    const user = await User.query().insert({
      email: keycloakUser.email,
      username: keycloakUser.preferred_username || keycloakUser.email,
      first_name: keycloakUser.given_name || 'Unknown',
      last_name: keycloakUser.family_name || 'Unknown',
      idp_id: 'keycloak',
      external_idp_id: keycloakUser.sub,
      country: 'US', // Default, should be determined
      currency: 'USD', // Default, should be determined
      status: UserStatus.ACTIVE,
      is_active: true,
      tfa: false,
      password_digest: '', // No password for OAuth users
      mobile_no: '',
      mobile_country_code: '',
    });

    this.logger.log(`Created new user ${user.id} from Keycloak`);
    return user;
  }
}
