import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.withSchema('profile').createTable('profile_settings', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('description').unique().nullable().defaultTo(null);
    table.boolean('newsletter_subscription').notNullable().defaultTo(true);
    table.boolean('new_messages_subscription').notNullable().defaultTo(true);
    table.boolean('new_notifications_subscription').notNullable().defaultTo(true);
    table.string('avatar_path').nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('profile').dropTable('profile_settings');
}
