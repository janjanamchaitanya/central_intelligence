import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('session_activities', (table) => {
    // Primary Key
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    // Foreign Keys
    table.uuid('session_id').notNullable();
    table.foreign('session_id').references('id').inTable('sessions').onDelete('CASCADE');

    // Activity Information
    table.string('activity_type', 50).notNullable(); // login, logout, api_request, page_view, etc.
    table.string('endpoint', 255).nullable();
    table.string('method', 10).nullable(); // GET, POST, etc.
    table.integer('status_code').nullable();

    // Request Information
    table.specificType('ip_address', 'INET').notNullable();
    table.text('user_agent').nullable();

    // Location Information
    table.string('city', 100).nullable();
    table.string('country', 100).nullable();
    table.decimal('latitude', 10, 7).nullable();
    table.decimal('longitude', 10, 7).nullable();

    // Metadata
    table.jsonb('metadata').nullable();

    // Timestamps
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('session_id');
    table.index('activity_type');
    table.index('created_at');
    table.index(['session_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('session_activities');
}
