import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('file_system');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('file_system');
}
