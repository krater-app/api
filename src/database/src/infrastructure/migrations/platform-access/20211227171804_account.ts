import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('platform_access').createTable('account', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('email').notNullable().unique();
    table.string('nickname').notNullable().unique();
    table.text('password_hash').notNullable();
    table.timestamp('registered_at').notNullable();
    table.timestamp('email_confirmed_at').nullable().defaultTo(null);
    table.string('status').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('platform_access').dropTable('account');
}
