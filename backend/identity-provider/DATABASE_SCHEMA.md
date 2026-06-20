# Database Schema Documentation

## Overview

All database models have been updated to match the exact schema specification from `Db_schemas.pdf`. All column names use **snake_case** and primary keys use **UUID** instead of auto-incrementing integers.

## Schema Changes

### Key Changes from Original Implementation

1. **ID Type**: Changed from `integer` to `UUID` (using PostgreSQL's `uuid-ossp` extension)
2. **Column Naming**: All columns now use `snake_case` instead of `camelCase`
3. **Timestamp Columns**:
   - `createdAt` → `created_at`
   - `updatedAt` → `updated_at`
   - `deletedAt` → `deleted_at`
4. **Soft Delete**:
   - Users and Employees use `is_active` flag (no soft delete)
   - UserDevices and IdentityProviders use `deleted_at` (soft delete enabled)

## Tables

### 1. Users Table

**Purpose**: Core user authentication and profile information

**Columns**:
- `id` (UUID, PK) - Primary key
- `first_name` (VARCHAR) - User's first name
- `last_name` (VARCHAR) - User's last name
- `middle_name` (VARCHAR, nullable) - User's middle name
- `email` (VARCHAR, unique, indexed) - Email address
- `password_digest` (VARCHAR) - Hashed password
- `mobile_no` (VARCHAR) - Mobile phone number
- `mobile_country_code` (VARCHAR) - Country code for mobile
- `username` (VARCHAR, unique, indexed) - Unique username
- `idp_id` (VARCHAR) - Identity provider ID
- `external_idp_id` (VARCHAR, nullable, indexed) - External IDP reference
- `country` (CHAR(2)) - ISO 3166-1 alpha-2 country code
- `currency` (CHAR(3)) - ISO 4217 currency code
- `status` (ENUM) - Account status: active, inactive, suspended, pending_verification
- `last_password_updated_at` (TIMESTAMP, nullable)
- `last_login` (TIMESTAMP, nullable)
- `reset_password_token` (VARCHAR, nullable)
- `reset_password_sent_at` (TIMESTAMP, nullable)
- `allow_password_change` (BOOLEAN, nullable)
- `initial_password_changed` (BOOLEAN, nullable)
- `initial_password_changed_at` (TIMESTAMP, nullable)
- `2fa` (BOOLEAN, nullable, default: true) - Two-factor authentication enabled
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())
- `is_active` (BOOLEAN, default: true)

**Indexes**:
- email
- username
- external_idp_id (if exists)
- status
- created_at

**Relations**:
- Has many: employees, sessions, user_devices

---

### 2. Employees Table

**Purpose**: Employee-specific information linked to users

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id, indexed)
- `employee_code` (VARCHAR, nullable)
- `department` (VARCHAR, nullable)
- `designation` (VARCHAR, nullable)
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())
- `is_active` (BOOLEAN, default: true)

**Foreign Keys**:
- `user_id` → `users.id` (CASCADE on delete)

**Relations**:
- Belongs to: user

---

### 3. Sessions Table

**Purpose**: Track user login sessions across devices

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id, indexed)
- `device_type` (VARCHAR) - mobile, tablet, desktop
- `ip_address` (INET) - IP address of session
- `session_token` (VARCHAR, indexed) - Session token
- `status` (VARCHAR) - Session status
- `session_hash` (VARCHAR) - Hashed session identifier
- `auth_method` (VARCHAR) - password, biometric, otp
- `login_flow` (VARCHAR) - web, mobile, api
- `is_authenticated` (BOOLEAN, default: false)
- `device_id` (VARCHAR, nullable)
- `country` (VARCHAR) - Country of login
- `timezone` (VARCHAR) - Timezone of login
- `suspicious` (BOOLEAN, default: false) - Suspicious activity flag
- `login_at` (TIMESTAMP) - Login timestamp
- `expires_at` (TIMESTAMP, indexed) - Session expiration
- `logout_at` (TIMESTAMP, nullable) - Logout timestamp
- `correlation_id` (UUID, indexed) - Request correlation ID
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())

**Foreign Keys**:
- `user_id` → `users.id` (CASCADE on delete)

**Indexes**:
- user_id
- session_token
- correlation_id
- expires_at
- (user_id, is_authenticated) - Composite index

**Relations**:
- Belongs to: user

---

### 4. User Devices Table

**Purpose**: Track and manage user devices for security and fraud detection

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id, indexed)
- `device_id` (VARCHAR, indexed)
- `external_device_id` (VARCHAR, nullable) - Vendor/APNS/FCM identifier
- `device_name` (VARCHAR) - User-friendly device name
- `device_type` (VARCHAR) - mobile, desktop, tablet
- `manufacturer` (VARCHAR) - apple, samsung, etc.
- `model` (VARCHAR, nullable)
- `os_name` (VARCHAR) - iOS, Android, Windows
- `os_version` (VARCHAR, nullable)
- `app_version` (VARCHAR, nullable)
- `browser_name` (VARCHAR, nullable)
- `browser_version` (VARCHAR, nullable)
- `user_agent` (TEXT, nullable)
- `trust_level` (VARCHAR, default: 'trusted') - trusted, untrusted, suspicious
- `device_status` (VARCHAR, default: 'active') - active, blocked, revoked
- `is_biometric_enabled` (BOOLEAN, default: false)
- `is_rooted_or_jailbroken` (BOOLEAN, default: false)
- `is_emulator` (BOOLEAN, default: false)
- `registered_at` (TIMESTAMP)
- `registration_ip` (INET)
- `registration_country` (VARCHAR)
- `registration_city` (VARCHAR)
- `first_seen_at` (TIMESTAMP)
- `last_seen_at` (TIMESTAMP, nullable)
- `last_ip_address` (INET)
- `risk_score` (INTEGER, default: 0)
- `risk_level` (VARCHAR, default: 'low') - low, medium, high
- `failed_login_count` (INTEGER, nullable)
- `fraud_flag` (BOOLEAN, default: false)
- `push_token` (VARCHAR, nullable)
- `push_provider` (VARCHAR, nullable)
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())
- `deleted_at` (TIMESTAMP, nullable) - **Soft delete enabled**

**Foreign Keys**:
- `user_id` → `users.id` (CASCADE on delete)

**Indexes**:
- user_id
- device_id
- (user_id, device_id) - Composite index
- trust_level
- device_status

**Relations**:
- Belongs to: user

**Soft Delete**: Enabled (uses `deleted_at` column)

---

### 5. Identity Providers Table

**Purpose**: Configure and manage multiple authentication providers

**Columns**:
- `id` (UUID, PK)
- `provider_code` (VARCHAR, unique, indexed) - Unique provider code
- `provider_name` (VARCHAR, unique) - Display name
- `provider_type` (VARCHAR, indexed) - local, social, enterprise
- `is_enabled` (BOOLEAN, default: true, indexed)
- `is_default` (BOOLEAN) - Default provider flag
- `supports_mfa` (BOOLEAN, default: true)
- `supports_password` (BOOLEAN, default: true)
- `supports_otp` (BOOLEAN, default: true)
- `supports_biometric` (BOOLEAN, default: true)
- `max_failed_attempts` (INTEGER, default: 3)
- `lockout_duration_seconds` (INTEGER)
- `session_timeout_seconds` (INTEGER)
- `auth_endpoint` (TEXT, nullable) - Authentication endpoint URL
- `created_at` (TIMESTAMP, default: now())
- `updated_at` (TIMESTAMP, default: now())
- `created_by` (UUID)
- `updated_by` (UUID)
- `deleted_at` (TIMESTAMP) - **Note: Schema shows as mandatory**
- `is_active` (BOOLEAN, default: true)

**Indexes**:
- provider_code
- provider_type
- is_enabled

**Soft Delete**: Enabled (uses `deleted_at` column)

---

## Model Files

All models are located in `src/database/models/`:

1. **base.model.ts** - Base model with UUID support, timestamps, and soft delete
2. **user.model.ts** - User model
3. **employee.model.ts** - Employee model
4. **session.model.ts** - Session model
5. **user-device.model.ts** - UserDevice model
6. **identity-provider.model.ts** - IdentityProvider model
7. **index.ts** - Exports all models

## Migration Files

**File**: `src/database/migrations/20250618000001_create_all_tables.ts`

Creates all tables with proper:
- UUID extension (`uuid-ossp`)
- Primary keys using `uuid_generate_v4()`
- Foreign key constraints with CASCADE delete
- Indexes for performance
- Default values
- INET types for IP addresses

## Usage Examples

### Creating a User

```typescript
import { User } from '@database/models';

const user = await User.query().insert({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password_digest: hashedPassword,
  mobile_no: '1234567890',
  mobile_country_code: '+1',
  username: 'johndoe',
  idp_id: 'local',
  country: 'US',
  currency: 'USD',
  status: 'active',
});
```

### Querying with Relations

```typescript
// Get user with sessions
const user = await User.query()
  .findById(userId)
  .withGraphFetched('[sessions, userDevices]');

// Get active sessions for user
const sessions = await Session.query()
  .where('user_id', userId)
  .where('is_authenticated', true)
  .where('expires_at', '>', new Date());
```

### Soft Delete (UserDevice)

```typescript
// Soft delete (sets deleted_at)
await userDevice.$delete();

// Force delete (permanent)
await userDevice.$forceDelete();

// Query including soft deleted
const allDevices = await UserDevice.query()
  .where('user_id', userId)
  .withDeleted();

// Query only soft deleted
const deletedDevices = await UserDevice.query()
  .where('user_id', userId)
  .onlyDeleted();
```

## Running Migrations

```bash
# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback

# Create new migration
npm run db:migrate:make migration_name
```

## Notes

1. **UUID Generation**: PostgreSQL's `uuid_generate_v4()` is used for automatic UUID generation
2. **Timestamps**: Automatically managed by BaseModel's `$beforeInsert` and `$beforeUpdate` hooks
3. **INET Type**: Used for IP addresses (ip_address, registration_ip, last_ip_address)
4. **Soft Delete Behavior**:
   - Users & Employees: Use `is_active` flag
   - UserDevices & IdentityProviders: Use `deleted_at` timestamp
   - Sessions: No soft delete (hard delete only)
5. **Foreign Keys**: All set to CASCADE on delete for data integrity
6. **Indexes**: Created on frequently queried columns for performance

## Schema Source

All schema definitions match the specifications in `Db_schemas.pdf` with exact column names, data types, and constraints.
