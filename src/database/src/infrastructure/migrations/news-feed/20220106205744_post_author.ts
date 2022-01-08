import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('post_author', (table) => {
    table.uuid('id').unique().notNullable();
    table.string('nickname').unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('post_author');
}
