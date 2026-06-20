import { BaseModel } from './base.model';
import { Session } from './session.model';

export class SessionActivity extends BaseModel {
  static tableName = 'session_activities';

  id!: string;
  session_id!: string;
  activity_type!: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  ip_address!: string;
  user_agent?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, any>;
  created_at!: Date;

  // Relationships
  static relationMappings = {
    session: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'session.model',
      join: {
        from: 'session_activities.session_id',
        to: 'sessions.id',
      },
    },
  };

  session?: Session;
}
