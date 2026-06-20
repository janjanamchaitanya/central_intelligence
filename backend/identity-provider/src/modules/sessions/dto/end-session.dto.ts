import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class EndSessionDto {
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
