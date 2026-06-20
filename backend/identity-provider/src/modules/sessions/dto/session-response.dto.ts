import { DeviceType } from '../../auth/dto/login.dto';

export class SessionResponseDto {
  id: string;
  user_id: string;
  device_type: DeviceType;
  device_name?: string;
  browser?: string;
  browser_version?: string;
  os_version?: string;
  ip_address: string;
  location?: {
    city?: string;
    country?: string;
  };
  is_active: boolean;
  is_current: boolean;
  created_at: Date;
  last_active_at: Date;
  expires_at: Date;
  activity_count?: number;
}

export class SessionListResponseDto {
  sessions: SessionResponseDto[];
  total: number;
  active_count: number;
}
