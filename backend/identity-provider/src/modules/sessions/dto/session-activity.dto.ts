export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  API_REQUEST = 'api_request',
  PAGE_VIEW = 'page_view',
  TOKEN_REFRESH = 'token_refresh',
  PASSWORD_CHANGE = 'password_change',
  SECURITY_EVENT = 'security_event',
}

export class SessionActivityDto {
  id: string;
  session_id: string;
  activity_type: ActivityType;
  endpoint?: string;
  method?: string;
  status_code?: number;
  ip_address: string;
  user_agent?: string;
  location?: {
    city?: string;
    country?: string;
  };
  metadata?: Record<string, any>;
  created_at: Date;
}

export class SessionActivityListDto {
  activities: SessionActivityDto[];
  total: number;
  session_id: string;
}
