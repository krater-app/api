import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('krater');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('krater');
}
