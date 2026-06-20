import { BaseModel } from './base.model';
import { Model } from 'objection';
import { User } from './user.model';

export class Employee extends BaseModel {
  static tableName = 'employees';

  id!: string;
  user_id!: string;
  employee_code?: string;
  department?: string;
  designation?: string;
  is_active!: boolean;

  // Timestamps (inherited from BaseModel)
  created_at!: Date;
  updated_at!: Date;

  // Relations
  user?: User;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'is_active'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        employee_code: { type: ['string', 'null'] },
        department: { type: ['string', 'null'] },
        designation: { type: ['string', 'null'] },
        is_active: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'employees.user_id',
          to: 'users.id',
        },
      },
    };
  }

  // Disable soft delete for Employee model since schema uses is_active instead
  static get useSoftDelete() {
    return false;
  }
}
