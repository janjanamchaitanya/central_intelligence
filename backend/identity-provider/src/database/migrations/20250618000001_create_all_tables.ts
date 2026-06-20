import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable UUID extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Create users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('middle_name').nullable();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.string('mobile_no').notNullable();
    table.string('mobile_country_code').notNullable();
    table.string('username').notNullable().unique();
    table.string('idp_id').notNullable();
    table.string('external_idp_id').nullable();
    table.string('country', 2).notNullable(); // ISO 3166-1 alpha-2
    table.string('currency', 3).notNullable(); // ISO 4217
    table.enum('status', ['active', 'inactive', 'suspended', 'pending_verification'])
      .notNullable()
      .defaultTo('pending_verification');
    table.timestamp('last_password_updated_at').nullable();
    table.timestamp('last_login').nullable();
    table.string('reset_password_token').nullable();
    table.timestamp('reset_password_sent_at').nullable();
    table.boolean('allow_password_change').nullable();
    table.boolean('initial_password_changed').nullable();
    table.timestamp('initial_password_changed_at').nullable();
    table.boolean('tfa').nullable().defaultTo(true); // 2fa renamed to tfa (can't start with number)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);

    // Indexes
    table.index('email');
    table.index('username');
    table.index('external_idp_id');
    table.index('status');
    table.index('created_at');
  });

  // Create employees table
  await knex.schema.createTable('employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.string('employee_code').nullable();
    table.string('department').nullable();
    table.string('designation').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.boolean('is_active').notNullable().defaultTo(true);

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index('user_id');
  });

  // Create sessions table
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.string('device_type').notNullable(); // mobile, tablet, desktop
    table.specificType('ip_address', 'INET').notNullable();
    table.string('session_token').notNullable();
    table.string('status').notNullable();
    table.string('session_hash').notNullable();
    table.string('auth_method').notNullable(); // password, biometric, otp
    table.string('login_flow').notNullable(); // web, mobile, api
    table.boolean('is_authenticated').notNullable().defaultTo(false);
    table.string('device_id').nullable();
    table.string('country').notNullable();
    table.string('timezone').notNullable();
    table.boolean('suspicious').notNullable().defaultTo(false);
    table.timestamp('login_at').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('logout_at').nullable();
    table.uuid('correlation_id').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index('user_id');
    table.index('session_token');
    table.index('correlation_id');
    table.index('expires_at');
    table.index(['user_id', 'is_authenticated']);
  });

  // Create user_devices table
  await knex.schema.createTable('user_devices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.string('device_id').notNullable();
    table.string('external_device_id').nullable();
    table.string('device_name').notNullable();
    table.string('device_type').notNullable(); // mobile, desktop, tablet
    table.string('manufacturer').notNullable();
    table.string('model').nullable();
    table.string('os_name').notNullable();
    table.string('os_version').nullable();
    table.string('app_version').nullable();
    table.string('browser_name').nullable();
    table.string('browser_version').nullable();
    table.text('user_agent').nullable();
    table.string('trust_level').notNullable().defaultTo('trusted'); // trusted, untrusted, suspicious
    table.string('device_status').notNullable().defaultTo('active'); // active, blocked, revoked
    table.boolean('is_biometric_enabled').notNullable().defaultTo(false);
    table.boolean('is_rooted_or_jailbroken').notNullable().defaultTo(false);
    table.boolean('is_emulator').notNullable().defaultTo(false);
    table.timestamp('registered_at').notNullable();
    table.specificType('registration_ip', 'INET').notNullable();
    table.string('registration_country').notNullable();
    table.string('registration_city').notNullable();
    table.timestamp('first_seen_at').notNullable();
    table.timestamp('last_seen_at').nullable();
    table.specificType('last_ip_address', 'INET').notNullable();
    table.integer('risk_score').notNullable().defaultTo(0);
    table.string('risk_level').notNullable().defaultTo('low'); // low, medium, high
    table.integer('failed_login_count').nullable();
    table.boolean('fraud_flag').notNullable().defaultTo(false);
    table.string('push_token').nullable();
    table.string('push_provider').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index('user_id');
    table.index('device_id');
    table.index(['user_id', 'device_id']);
    table.index('trust_level');
    table.index('device_status');
  });

  // Create identity_providers table
  await knex.schema.createTable('identity_providers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('provider_code').notNullable().unique();
    table.string('provider_name').notNullable().unique();
    table.string('provider_type').notNullable(); // local, social, enterprise
    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.boolean('is_default').notNullable();
    table.boolean('supports_mfa').notNullable().defaultTo(true);
    table.boolean('supports_password').notNullable().defaultTo(true);
    table.boolean('supports_otp').notNullable().defaultTo(true);
    table.boolean('supports_biometric').notNullable().defaultTo(true);
    table.integer('max_failed_attempts').notNullable().defaultTo(3);
    table.integer('lockout_duration_seconds').notNullable();
    table.integer('session_timeout_seconds').notNullable();
    table.text('auth_endpoint').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.uuid('created_by').notNullable();
    table.uuid('updated_by').notNullable();
    table.timestamp('deleted_at').nullable(); // Changed to nullable
    table.boolean('is_active').notNullable().defaultTo(true);

    // Indexes
    table.index('provider_code');
    table.index('provider_type');
    table.index('is_enabled');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('identity_providers');
  await knex.schema.dropTableIfExists('user_devices');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
