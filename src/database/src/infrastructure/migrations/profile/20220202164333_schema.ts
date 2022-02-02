import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('profile');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('profile');
}
