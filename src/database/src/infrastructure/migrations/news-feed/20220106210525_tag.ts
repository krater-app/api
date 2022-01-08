import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('tag', (table) => {
    table.uuid('id').unique().notNullable();
    table.text('name').unique().notNullable();
    table.timestamp('created_at').notNullable();
    table.uuid('author_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('tag');
}
