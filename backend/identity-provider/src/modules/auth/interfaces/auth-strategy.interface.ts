import { LoginDto } from '../dto/login.dto';
import { User } from '../../../database/models/user.model';

export interface AuthResult {
  user: User;
  requires_2fa: boolean;
  temp_token?: string;
  metadata?: Record<string, any>;
}

export interface IAuthStrategy {
  authenticate(loginDto: LoginDto): Promise<AuthResult>;
  validateCredentials(credentials: any): Promise<boolean>;
}
