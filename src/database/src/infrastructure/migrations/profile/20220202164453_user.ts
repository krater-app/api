import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('profile').createTable('user', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('nickname').unique().notNullable();
    table.timestamp('joined_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('profile').dropTable('user');
}
