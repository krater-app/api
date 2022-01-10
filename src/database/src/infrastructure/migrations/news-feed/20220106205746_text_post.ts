import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('text_post', (table) => {
    table.uuid('id').unique().notNullable();
    table.text('content').notNullable();

    table.foreign('id').references('id').inTable('news_feed.post');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('text_post');
}
