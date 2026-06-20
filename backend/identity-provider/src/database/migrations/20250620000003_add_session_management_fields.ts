import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add session management fields to sessions table
  await knex.schema.alterTable('sessions', (table) => {
    // Token management
    table.text('refresh_token').nullable();

    // Browser/Device info
    table.string('browser', 100).nullable();
    table.string('browser_version', 50).nullable();
    table.string('os_version', 50).nullable();
    table.string('os_type', 50).nullable();
    table.text('user_agent').nullable();

    // Location
    table.string('city', 100).nullable();

    // Session state
    table.boolean('is_active').nullable().defaultTo(true);
    table.timestamp('last_active_at').nullable();
    table.timestamp('ended_at').nullable();

    // Metadata for additional data
    table.jsonb('metadata').nullable();

    // Indexes for performance
    table.index('is_active');
    table.index('last_active_at');
    table.index('ended_at');
    table.index('refresh_token');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('sessions', (table) => {
    table.dropColumn('refresh_token');
    table.dropColumn('browser');
    table.dropColumn('browser_version');
    table.dropColumn('os_version');
    table.dropColumn('os_type');
    table.dropColumn('user_agent');
    table.dropColumn('city');
    table.dropColumn('is_active');
    table.dropColumn('last_active_at');
    table.dropColumn('ended_at');
    table.dropColumn('metadata');
  });
}
