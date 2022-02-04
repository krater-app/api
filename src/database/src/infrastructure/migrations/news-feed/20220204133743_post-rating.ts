import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('post_rating', (table) => {
    table.uuid('id').primary();
    table.uuid('post_id').notNullable();
    table.uuid('account_id').notNullable();
    table.timestamp('created_at').notNullable();
    table.string('rating_type').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('post_rating');
}
