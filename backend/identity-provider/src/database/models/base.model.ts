import { Model, ModelOptions, QueryContext } from 'objection';

export class BaseModel extends Model {
  id!: string; // UUID instead of number
  created_at!: Date; // snake_case instead of camelCase
  updated_at!: Date; // snake_case instead of camelCase
  deleted_at?: Date | null; // snake_case instead of camelCase

  static get modelPaths() {
    return [__dirname];
  }

  // Enable timestamp columns
  $beforeInsert(queryContext: QueryContext) {
    super.$beforeInsert(queryContext);
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    super.$beforeUpdate(opt, queryContext);
    this.updated_at = new Date();
  }

  // Soft delete support
  static get useSoftDelete() {
    return true;
  }

  static get softDeleteColumn() {
    return 'deleted_at';
  }

  // Override delete to perform soft delete
  async $delete() {
    if ((this.constructor as typeof BaseModel).useSoftDelete) {
      this.deleted_at = new Date();
      return this.$query().patch({ deleted_at: this.deleted_at });
    }
    return super.$query().delete();
  }

  // Method to force delete
  async $forceDelete() {
    return super.$query().delete();
  }

  // Soft delete will be handled at query level, not via QueryBuilder override
  // This simplifies the implementation and avoids TypeScript complications
}
