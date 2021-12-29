import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('krater').createTable('outbox_message', (table) => {
    table.uuid('id');
    table.timestamp('occured_on').notNullable();
    table.string('type').notNullable();
    table.string('module').notNullable();
    table.text('data').notNullable().defaultTo('{}');
    table.timestamp('processed_on').nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('krater').dropTable('outbox_message');
}
