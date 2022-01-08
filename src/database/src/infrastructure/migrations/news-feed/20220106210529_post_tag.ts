import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('post_tag', (table) => {
    table.uuid('id').unique().notNullable();
    table.uuid('post_id').notNullable();
    table.uuid('tag_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('post_tag');
}
