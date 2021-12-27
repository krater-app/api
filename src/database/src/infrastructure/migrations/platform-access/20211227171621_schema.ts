import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('platform_access');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('platform_access');
}
