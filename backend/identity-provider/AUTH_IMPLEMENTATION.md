# Authentication & Session Management Implementation

## Overview
Complete implementation of user authentication and session management with enterprise patterns including Strategy Pattern, Dependency Injection, Device Binding, and Event-Driven Architecture.

## Architecture

### Login Flow Pattern
The login process follows these steps:
1. **Input Validation** (Dependency Injection)
2. **Authentication** (Strategy Pattern)
3. **Session Creation**
4. **Device Binding** (Strategy Pattern)
5. **Record Session Activity**
6. **Publish Events** (Kafka for Central Intelligence)

## Components

### 1. DTOs (Data Transfer Objects)
Located in: `src/modules/auth/dto/` and `src/modules/sessions/dto/`

- **LoginDto**: Input for login with auth strategy and device info
- **LoginResponseDto**: Response with tokens and user data
- **LogoutDto**: Input for logout
- **SessionResponseDto**: Session information
- **SessionActivityDto**: Activity tracking data
- **EndSessionDto**: End session request

### 2. Validation Layer (Dependency Injection)

**File**: `src/modules/auth/validators/login.validator.ts`

```typescript
@Injectable()
export class LoginValidator implements ILoginValidator {
  async validate(loginDto: LoginDto): Promise<void>
}
```

Features:
- Strategy-specific validation (Password+OTP, OAuth, etc.)
- Email/username validation
- Password strength validation
- Device info validation
- Injected into AuthService for loose coupling

### 3. Authentication Strategy Pattern

**Interface**: `src/modules/auth/interfaces/auth-strategy.interface.ts`

```typescript
export interface IAuthStrategy {
  authenticate(loginDto: LoginDto): Promise<AuthResult>;
  validateCredentials(credentials: any): Promise<boolean>;
}
```

**Implementations**:
- **PasswordOtpStrategy**: Traditional password + optional OTP
  - Supports 2FA flow
  - OTP generation and validation
  - Password hashing with bcrypt

- **AzureB2CStrategy**: Azure AD B2C integration
  - Token validation
  - User auto-provisioning
  - External ID mapping

- **KeycloakStrategy**: Keycloak SSO integration
  - OIDC token handling
  - Realm-based authentication
  - User synchronization

**Factory**: `src/modules/auth/strategies/auth-strategy.factory.ts`
- Returns appropriate strategy based on `auth_strategy` field
- Easy to extend with new providers (Google, Apple, etc.)

### 4. Device Binding Strategy Pattern

**Interface**: `src/modules/auth/interfaces/device-binding.interface.ts`

```typescript
export interface IDeviceBindingStrategy {
  bind(userId: string, deviceInfo: DeviceInfoDto, sessionId: string): Promise<DeviceBindingResult>;
  validateDevice(device: UserDevice): Promise<boolean>;
  generateFingerprint(deviceInfo: DeviceInfoDto): string;
}
```

**Implementations**:

**WebDeviceStrategy** (`web-device.strategy.ts`):
- Browser fingerprinting
- Screen resolution tracking
- User agent analysis
- Risk scoring based on:
  - New device detection
  - IP address changes
  - Browser fingerprint mismatches
  - Login count history

**MobileDeviceStrategy** (`mobile-device.strategy.ts`):
- Device UUID tracking
- App version monitoring
- GPS location tracking
- Distance-based risk calculation (Haversine formula)
- Platform-specific (Android/iOS) handling

**Factory**: `device-binding.factory.ts`
- Routes to appropriate strategy based on device_type
- Supports: web, desktop, android, ios, tablet

### 5. Session Management

**SessionService** (`src/modules/sessions/services/session.service.ts`):

Key Methods:
```typescript
createSession(data: SessionCreateData): Promise<{ session: Session; tokens: TokenPair }>
findSession(sessionId: string): Promise<Session | null>
findUserSessions(userId: string, includeInactive?: boolean): Promise<Session[]>
endSession(sessionId: string, userId: string, reason?: string): Promise<void>
endAllUserSessions(userId: string, exceptSessionId?: string): Promise<number>
validateSession(sessionId: string): Promise<Session>
refreshSession(refreshToken: string): Promise<TokenPair>
```

Features:
- JWT token generation (access + refresh)
- Token hashing for storage
- Session expiration management
- Multi-device session tracking

### 6. Session Activity Recording

**SessionActivityService** (`src/modules/sessions/services/session-activity.service.ts`):

Tracks:
- Login/Logout events
- API requests
- Page views
- Security events
- Token refreshes

Methods:
```typescript
recordActivity(data: ActivityData): Promise<SessionActivity>
getSessionActivities(sessionId: string): Promise<{ activities, total }>
getUserActivities(userId: string): Promise<{ activities, total }>
recordLogin(sessionId: string, ipAddress: string): Promise<SessionActivity>
recordLogout(sessionId: string, ipAddress: string, reason?: string): Promise<SessionActivity>
recordSecurityEvent(sessionId: string, ipAddress: string, event: string): Promise<SessionActivity>
```

### 7. Error Handling

**Custom Exceptions** (`src/common/exceptions/auth.exception.ts`):

- `AuthenticationException`
- `InvalidCredentialsException`
- `AccountInactiveException`
- `TwoFactorRequiredException`
- `InvalidOtpException`
- `SessionExpiredException`
- `DeviceNotTrustedException`
- `RateLimitException`

**Global Exception Filter** (`http-exception.filter.ts`):
- Catches all exceptions
- Formats error responses
- Logs errors with correlation IDs
- Returns standardized error format

### 8. Event Publishing (Kafka for Central Intelligence)

**EventPublisherService** (`src/common/events/event-publisher.service.ts`):

**Event Types**:
- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `LOGOUT`
- `SESSION_CREATED`
- `SESSION_ENDED`
- `DEVICE_BOUND`
- `NEW_DEVICE_DETECTED`
- `SUSPICIOUS_ACTIVITY`
- `TWO_FACTOR_REQUIRED`
- `PASSWORD_CHANGE`

**Event Structure**:
```typescript
interface BaseAuthEvent {
  event_type: AuthEventType;
  timestamp: Date;
  correlation_id: string;
  user_id?: string;
  session_id?: string;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}
```

**Kafka Topic**: `payment-intelligence.auth.events`

All events include:
- Correlation ID for distributed tracing
- Timestamp
- User context
- IP address and user agent
- Custom metadata

### 9. API Endpoints

#### Authentication Controller (`/auth`)

**POST /auth/login**
```json
{
  "auth_strategy": "password_otp",
  "email": "user@example.com",
  "password": "password123",
  "otp": "123456",
  "device_info": {
    "device_type": "web",
    "device_id": "unique-device-id",
    "browser": "Chrome",
    "os_version": "Windows 10",
    "ip_address": "192.168.1.1"
  }
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user",
    "first_name": "John",
    "last_name": "Doe"
  },
  "session": {
    "id": "uuid",
    "created_at": "2026-06-20T00:00:00Z",
    "expires_at": "2026-06-27T00:00:00Z"
  }
}
```

**POST /auth/logout**
```json
{
  "session_id": "uuid",
  "all_sessions": false,
  "reason": "user_logout"
}
```

**POST /auth/refresh**
```json
{
  "refresh_token": "eyJhbGc..."
}
```

**GET /auth/me**
Returns current authenticated user

#### Session Controller (`/sessions`)

**GET /sessions**
- Lists all user sessions
- Query params: `include_inactive=true`
- Returns active/inactive sessions with device info

**GET /sessions/:sessionId**
- Get specific session details
- Includes activity count

**GET /sessions/:sessionId/activity**
- List session activities
- Pagination support: `?limit=50&offset=0`
- Returns login, logout, API calls, security events

**DELETE /sessions/:sessionId**
```json
{
  "session_id": "uuid",
  "reason": "manual_logout"
}
```

**DELETE /sessions**
- End all sessions
- Query param: `except_current=true` (keeps current session active)

## Security Features

### 1. Risk-Based Authentication
- Device fingerprinting
- Location tracking
- Behavioral analysis
- Risk scores (0-100)
- Automatic fraud detection

### 2. Multi-Factor Authentication
- 2FA support built-in
- OTP generation and validation
- Temp tokens for 2FA flow

### 3. Session Security
- JWT with refresh tokens
- Token rotation on refresh
- Automatic session expiration
- Device-bound sessions
- IP address tracking

### 4. Audit Trail
- Complete activity logging
- Session history
- Login/logout events
- API request tracking
- Security event recording

## Database Models

### Session Model
- UUID primary key
- User and device relationships
- Token storage (hashed)
- Location tracking (city, country, lat/long)
- Browser/OS information
- Active/inactive status
- Expiration tracking

### UserDevice Model
- Device fingerprinting
- Login count tracking
- Trust status
- Block status
- Last login tracking
- Screen resolution
- Location data

### SessionActivity Model
- Activity type enum
- Endpoint and method tracking
- Status codes
- IP and user agent
- Location data
- Metadata storage

## Central Intelligence Events

All authentication events are published to Kafka for central intelligence processing:

1. **Login Success Events**: User authentication, device info, location
2. **Login Failed Events**: Failed attempts for fraud detection
3. **Device Binding Events**: New device detection, risk scores
4. **Suspicious Activity Events**: High-risk logins, unusual patterns
5. **Session Events**: Creation, termination, duration tracking
6. **Logout Events**: User-initiated or forced logouts

Events include correlation IDs for distributed tracing across microservices.

## Extensibility

### Adding New Auth Strategies
1. Create new strategy class implementing `IAuthStrategy`
2. Add to `AuthStrategyFactory`
3. Add enum value to `AuthStrategy`

Example:
```typescript
@Injectable()
export class GoogleStrategy implements IAuthStrategy {
  async authenticate(loginDto: LoginDto): Promise<AuthResult> {
    // Google OAuth implementation
  }
}
```

### Adding New Device Types
1. Create strategy implementing `IDeviceBindingStrategy`
2. Add to `DeviceBindingFactory`
3. Update `DeviceType` enum

### Adding New Events
1. Add event type to `AuthEventType`
2. Create event interface extending `BaseAuthEvent`
3. Add publisher method to `EventPublisherService`

## Environment Variables

Required in `.env`:
```bash
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret
SESSION_MAX_AGE=86400000

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=identity-provider
```

## Migration

Run migrations to create tables:
```bash
npm run db:migrate
```

Creates:
- `users` table (from previous migration)
- `employees` table
- `sessions` table
- `user_devices` table
- `identity_providers` table
- `session_activities` table (new)

## Testing

Example login flow:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "auth_strategy": "password_otp",
    "email": "user@example.com",
    "password": "SecurePass123",
    "device_info": {
      "device_type": "web",
      "device_id": "browser-fingerprint-123",
      "browser": "Chrome",
      "browser_version": "120.0",
      "os_version": "macOS 14.0"
    }
  }'
```

## Next Steps

1. Implement JWT Guard for protected routes
2. Add rate limiting middleware
3. Implement Redis caching for sessions
4. Add geolocation service integration
5. Implement email/SMS OTP delivery
6. Add biometric authentication support
7. Create admin dashboard for session management
8. Implement session analytics and reporting
