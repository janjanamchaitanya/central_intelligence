export enum AuthEventType {
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILED = 'auth.login.failed',
  LOGOUT = 'auth.logout',
  SESSION_CREATED = 'auth.session.created',
  SESSION_ENDED = 'auth.session.ended',
  TOKEN_REFRESHED = 'auth.token.refreshed',
  TWO_FACTOR_REQUIRED = 'auth.2fa.required',
  TWO_FACTOR_SUCCESS = 'auth.2fa.success',
  TWO_FACTOR_FAILED = 'auth.2fa.failed',
  DEVICE_BOUND = 'auth.device.bound',
  NEW_DEVICE_DETECTED = 'auth.device.new',
  SUSPICIOUS_ACTIVITY = 'auth.activity.suspicious',
  PASSWORD_CHANGE = 'auth.password.changed',
  ACCOUNT_LOCKED = 'auth.account.locked',
}

export interface BaseAuthEvent {
  event_type: AuthEventType;
  timestamp: Date;
  correlation_id: string;
  user_id?: string;
  session_id?: string;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export interface LoginSuccessEvent extends BaseAuthEvent {
  event_type: AuthEventType.LOGIN_SUCCESS;
  user_id: string;
  session_id: string;
  device_id: string;
  device_type: string;
  auth_strategy: string;
  location?: {
    city?: string;
    country?: string;
  };
}

export interface LoginFailedEvent extends BaseAuthEvent {
  event_type: AuthEventType.LOGIN_FAILED;
  email?: string;
  username?: string;
  reason: string;
  auth_strategy: string;
}

export interface LogoutEvent extends BaseAuthEvent {
  event_type: AuthEventType.LOGOUT;
  user_id: string;
  session_id: string;
  reason?: string;
}

export interface SessionCreatedEvent extends BaseAuthEvent {
  event_type: AuthEventType.SESSION_CREATED;
  user_id: string;
  session_id: string;
  device_id: string;
  expires_at: Date;
}

export interface SessionEndedEvent extends BaseAuthEvent {
  event_type: AuthEventType.SESSION_ENDED;
  user_id: string;
  session_id: string;
  reason: string;
  duration_seconds: number;
}

export interface DeviceBoundEvent extends BaseAuthEvent {
  event_type: AuthEventType.DEVICE_BOUND;
  user_id: string;
  device_id: string;
  device_type: string;
  is_new_device: boolean;
  is_trusted: boolean;
  risk_score: number;
}

export interface SuspiciousActivityEvent extends BaseAuthEvent {
  event_type: AuthEventType.SUSPICIOUS_ACTIVITY;
  user_id?: string;
  session_id?: string;
  activity_type: string;
  risk_score: number;
  details: Record<string, any>;
}
