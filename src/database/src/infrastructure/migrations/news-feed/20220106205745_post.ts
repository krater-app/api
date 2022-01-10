import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('post', (table) => {
    table.uuid('id').unique().primary();
    table.string('title').nullable();
    table.uuid('author_id').notNullable();
    table.string('status').notNullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').notNullable();
    table.boolean('nsfw').notNullable();

    table.foreign('author_id').references('id').inTable('news_feed.post_author');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('post');
}
