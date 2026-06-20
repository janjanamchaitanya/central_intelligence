import { Session } from "inspector";
import { BaseModel } from "./base.model";
import { Model } from "objection";
import { Employee, UserDevice } from ".";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export class User extends BaseModel {
  static tableName = "users";

  // Override id to be UUID instead of number
  id!: string;

  // User basic info
  first_name!: string;
  last_name!: string;
  middle_name?: string;
  email!: string;
  password_digest!: string;
  mobile_no!: string;
  mobile_country_code!: string;
  username!: string;

  // Identity provider info
  idp_id!: string;
  external_idp_id?: string;

  // Location and preferences
  country!: string; // ISO 3166-1 alpha-2 (2 characters)
  currency!: string; // ISO 4217 (3 characters)

  // Account status
  status!: UserStatus;

  // Password management
  last_password_updated_at?: Date;
  reset_password_token?: string;
  reset_password_sent_at?: Date;
  allow_password_change?: boolean;
  initial_password_changed?: boolean;
  initial_password_changed_at?: Date;

  // Login tracking
  last_login?: Date;

  // Security
  tfa?: boolean; // Two-factor authentication (renamed from 2fa as column names can't start with numbers)
  is_active!: boolean;

  // Timestamps (inherited from BaseModel but redeclared for clarity)
  created_at!: Date;
  updated_at!: Date;

  // Relations
  employees?: Employee[];
  sessions?: Session[];
  userDevices?: UserDevice[];

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "first_name",
        "last_name",
        "email",
        "password_digest",
        "mobile_no",
        "mobile_country_code",
        "username",
        "idp_id",
        "country",
        "currency",
        "status",
        "is_active",
      ],
      properties: {
        id: { type: "string", format: "uuid" },
        first_name: { type: "string", minLength: 1, maxLength: 255 },
        last_name: { type: "string", minLength: 1, maxLength: 255 },
        middle_name: { type: ["string", "null"], maxLength: 255 },
        email: { type: "string", format: "email" },
        password_digest: { type: "string" },
        mobile_no: { type: "string" },
        mobile_country_code: { type: "string" },
        username: { type: "string", minLength: 3, maxLength: 50 },
        idp_id: { type: "string" },
        external_idp_id: { type: ["string", "null"] },
        country: { type: "string", minLength: 2, maxLength: 2 },
        currency: { type: "string", minLength: 3, maxLength: 3 },
        status: { type: "string", enum: Object.values(UserStatus) },
        tfa: { type: ["boolean", "null"] },
        is_active: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    const { Employee } = require("./employee.model");
    const { Session } = require("./session.model");
    const { UserDevice } = require("./user-device.model");

    return {
      employees: {
        relation: Model.HasManyRelation,
        modelClass: Employee,
        join: {
          from: "users.id",
          to: "employees.user_id",
        },
      },
      sessions: {
        relation: Model.HasManyRelation,
        modelClass: Session,
        join: {
          from: "users.id",
          to: "sessions.user_id",
        },
      },
      userDevices: {
        relation: Model.HasManyRelation,
        modelClass: UserDevice,
        join: {
          from: "users.id",
          to: "user_devices.user_id",
        },
      },
    };
  }

  // Hide sensitive fields in JSON
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password_digest;
    delete json.reset_password_token;
    return json;
  }

  // Disable soft delete for User model since schema uses is_active instead
  static get useSoftDelete() {
    return false;
  }
}
