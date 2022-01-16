import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').createTable('feed_item', (table) => {
    table.uuid('id').notNullable().primary();
    table.string('title').nullable();
    table.text('content').nullable();
    table.text('description').nullable();
    table.text('image_path').nullable();
    table.string('type').notNullable();
    table.bigInteger('likes').notNullable().defaultTo(0);
    table.bigInteger('comments').notNullable().defaultTo(0);
    table.specificType('tags', 'text[]').notNullable().defaultTo('{}');
    table.timestamp('created_at').notNullable();
    table.string('created_by').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('news_feed').dropTable('feed_item');
}
