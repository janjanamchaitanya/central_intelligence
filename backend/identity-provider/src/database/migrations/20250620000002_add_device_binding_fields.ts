import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add device binding fields to user_devices table
  // Note: browser_version, os_version, app_version, user_agent already exist
  await knex.schema.alterTable('user_devices', (table) => {
    // Device fingerprinting
    table.string('fingerprint', 255).nullable();

    // Trust and status flags
    table.boolean('is_trusted').nullable().defaultTo(false);
    table.boolean('is_active').nullable().defaultTo(true);
    table.boolean('is_blocked').nullable().defaultTo(false);

    // Login tracking
    table.integer('login_count').nullable().defaultTo(0);
    table.timestamp('last_login_at').nullable();

    // Location tracking
    table.decimal('latitude', 10, 7).nullable();
    table.decimal('longitude', 10, 7).nullable();

    // Browser/Device info (browser is alias for browser_name which exists)
    table.integer('screen_width').nullable();
    table.integer('screen_height').nullable();
    table.string('os_type', 50).nullable();

    // Indexes for performance
    table.index('fingerprint');
    table.index('is_trusted');
    table.index('is_active');
    table.index('last_login_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_devices', (table) => {
    table.dropColumn('fingerprint');
    table.dropColumn('is_trusted');
    table.dropColumn('is_active');
    table.dropColumn('is_blocked');
    table.dropColumn('login_count');
    table.dropColumn('last_login_at');
    table.dropColumn('latitude');
    table.dropColumn('longitude');
    table.dropColumn('screen_width');
    table.dropColumn('screen_height');
    table.dropColumn('os_type');
  });
}
