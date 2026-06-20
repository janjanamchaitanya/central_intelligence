import { BaseModel } from './base.model';

export class IdentityProvider extends BaseModel {
  static tableName = 'identity_providers';

  id!: string;
  provider_code!: string;
  provider_name!: string;
  provider_type!: string; // local, social, enterprise
  is_enabled!: boolean;
  is_default!: boolean;
  supports_mfa!: boolean;
  supports_password!: boolean;
  supports_otp!: boolean;
  supports_biometric!: boolean;
  max_failed_attempts!: number;
  lockout_duration_seconds!: number;
  session_timeout_seconds!: number;
  auth_endpoint?: string;
  created_by!: string;
  updated_by!: string;
  deleted_at?: Date | null; // Nullable for soft delete
  is_active!: boolean;

  // Timestamps (inherited from BaseModel)
  created_at!: Date;
  updated_at!: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'provider_code',
        'provider_name',
        'provider_type',
        'is_enabled',
        'is_default',
        'supports_mfa',
        'supports_password',
        'supports_otp',
        'supports_biometric',
        'max_failed_attempts',
        'lockout_duration_seconds',
        'session_timeout_seconds',
        'created_by',
        'updated_by',
        'is_active',
      ],
      properties: {
        id: { type: 'string', format: 'uuid' },
        provider_code: { type: 'string' },
        provider_name: { type: 'string' },
        provider_type: { type: 'string', enum: ['local', 'social', 'enterprise'] },
        is_enabled: { type: 'boolean' },
        is_default: { type: 'boolean' },
        supports_mfa: { type: 'boolean' },
        supports_password: { type: 'boolean' },
        supports_otp: { type: 'boolean' },
        supports_biometric: { type: 'boolean' },
        max_failed_attempts: { type: 'integer', minimum: 1 },
        lockout_duration_seconds: { type: 'integer', minimum: 0 },
        session_timeout_seconds: { type: 'integer', minimum: 0 },
        auth_endpoint: { type: ['string', 'null'] },
        created_by: { type: 'string', format: 'uuid' },
        updated_by: { type: 'string', format: 'uuid' },
        deleted_at: { type: ['string', 'null'], format: 'date-time' },
        is_active: { type: 'boolean' },
      },
    };
  }

  // Enable soft delete for IdentityProvider (uses deleted_at from schema)
  static get useSoftDelete() {
    return true;
  }

  static get softDeleteColumn() {
    return 'deleted_at';
  }
}
