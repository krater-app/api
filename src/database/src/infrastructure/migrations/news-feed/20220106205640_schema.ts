import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createSchema('news_feed');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropSchema('news_feed');
}
