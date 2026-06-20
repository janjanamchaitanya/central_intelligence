import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsBoolean()
  @IsOptional()
  all_sessions?: boolean; // Logout from all devices

  @IsString()
  @IsOptional()
  reason?: string; // Logout reason
}
