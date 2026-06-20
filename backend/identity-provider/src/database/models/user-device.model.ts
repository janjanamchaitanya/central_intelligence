import { BaseModel } from './base.model';
import { Model } from 'objection';
import { User } from './user.model';

export class UserDevice extends BaseModel {
  static tableName = 'user_devices';

  id!: string;
  user_id!: string;
  device_id!: string;
  external_device_id?: string; // vendor/APNS/FCM
  device_name!: string;
  device_type!: string; // mobile, desktop, tablet
  manufacturer!: string; // apple, samsung
  model?: string;
  os_name!: string; // iOS, Android, Windows
  os_version?: string;
  app_version?: string;
  browser_name?: string;
  browser_version?: string;
  user_agent?: string;
  trust_level!: string; // trusted, untrusted, suspicious
  device_status!: string; // active, blocked, revoked
  is_biometric_enabled!: boolean;
  is_rooted_or_jailbroken!: boolean;
  is_emulator!: boolean;
  registered_at!: Date;
  registration_ip!: string; // INET type in PostgreSQL
  registration_country!: string;
  registration_city!: string;
  first_seen_at!: Date;
  last_seen_at?: Date;
  last_ip_address!: string; // INET type in PostgreSQL
  risk_score!: number;
  risk_level!: string; // low, medium, high
  failed_login_count?: number;
  fraud_flag!: boolean;
  push_token?: string;
  push_provider?: string;
  deleted_at?: Date;

  // Timestamps (inherited from BaseModel)
  created_at!: Date;
  updated_at!: Date;

  // Relations
  user?: User;

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'user_id',
        'device_id',
        'device_name',
        'device_type',
        'manufacturer',
        'os_name',
        'trust_level',
        'device_status',
        'is_biometric_enabled',
        'is_rooted_or_jailbroken',
        'is_emulator',
        'registered_at',
        'registration_ip',
        'registration_country',
        'registration_city',
        'first_seen_at',
        'last_ip_address',
        'risk_score',
        'risk_level',
        'fraud_flag',
      ],
      properties: {
        id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        device_id: { type: 'string' },
        external_device_id: { type: ['string', 'null'] },
        device_name: { type: 'string' },
        device_type: { type: 'string', enum: ['mobile', 'desktop', 'tablet'] },
        manufacturer: { type: 'string' },
        model: { type: ['string', 'null'] },
        os_name: { type: 'string' },
        os_version: { type: ['string', 'null'] },
        trust_level: { type: 'string', enum: ['trusted', 'untrusted', 'suspicious'] },
        device_status: { type: 'string', enum: ['active', 'blocked', 'revoked'] },
        is_biometric_enabled: { type: 'boolean' },
        is_rooted_or_jailbroken: { type: 'boolean' },
        is_emulator: { type: 'boolean' },
        risk_score: { type: 'integer', minimum: 0 },
        risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
        failed_login_count: { type: ['integer', 'null'] },
        fraud_flag: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_devices.user_id',
          to: 'users.id',
        },
      },
    };
  }

  // Enable soft delete for UserDevice (uses deleted_at from schema)
  static get useSoftDelete() {
    return true;
  }

  static get softDeleteColumn() {
    return 'deleted_at';
  }
}
