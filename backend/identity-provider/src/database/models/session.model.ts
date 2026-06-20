import { BaseModel } from './base.model';
import { Model } from 'objection';
import { User } from './user.model';

export class Session extends BaseModel {
  static tableName = 'sessions';

  id!: string;
  user_id!: string;
  device_type!: string; // mobile, tablet, desktop
  ip_address!: string; // INET type in PostgreSQL
  session_token!: string;
  status!: string;
  session_hash!: string;
  auth_method!: string; // password, biometric, otp
  login_flow!: string; // web, mobile, api
  is_authenticated!: boolean;
  device_id?: string;
  country!: string;
  timezone!: string;
  suspicious!: boolean;
  login_at!: Date;
  expires_at!: Date;
  logout_at?: Date;
  correlation_id!: string;

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
        'device_type',
        'ip_address',
        'session_token',
        'status',
        'session_hash',
        'auth_method',
        'login_flow',
        'is_authenticated',
        'country',
        'timezone',
        'suspicious',
        'login_at',
        'expires_at',
        'correlation_id',
      ],
      properties: {
        id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        device_type: { type: 'string', enum: ['mobile', 'tablet', 'desktop'] },
        ip_address: { type: 'string' },
        session_token: { type: 'string' },
        status: { type: 'string' },
        session_hash: { type: 'string' },
        auth_method: { type: 'string', enum: ['password', 'biometric', 'otp'] },
        login_flow: { type: 'string', enum: ['web', 'mobile', 'api'] },
        is_authenticated: { type: 'boolean' },
        device_id: { type: ['string', 'null'] },
        country: { type: 'string' },
        timezone: { type: 'string' },
        suspicious: { type: 'boolean' },
        login_at: { type: 'string', format: 'date-time' },
        expires_at: { type: 'string', format: 'date-time' },
        logout_at: { type: ['string', 'null'], format: 'date-time' },
        correlation_id: { type: 'string', format: 'uuid' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'sessions.user_id',
          to: 'users.id',
        },
      },
    };
  }

  // Disable soft delete for Session model
  static get useSoftDelete() {
    return false;
  }
}
