export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  session: {
    id: string;
    created_at: Date;
    expires_at: Date;
  };
  requires_2fa?: boolean;
  temp_token?: string; // If 2FA is required
}
