import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('file_system').createTable('file', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('name').notNullable();
    table.text('path').notNullable();
    table.string('status').notNullable();
    table.uuid('author_id').notNullable();
    table.timestamp('uploaded_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('file_system').dropTable('file');
}
