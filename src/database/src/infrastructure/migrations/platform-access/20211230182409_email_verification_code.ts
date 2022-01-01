import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .withSchema('platform_access')
    .createTable('email_verification_code', (table) => {
      table.uuid('id').unique().primary().notNullable();
      table.string('code').notNullable();
      table.string('status').notNullable();
      table.timestamp('generated_at').notNullable();
      table.uuid('account_id').notNullable();

      table.foreign('account_id').references('id').inTable('platform_access.account');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.withSchema('platform_access').dropTable('email_verification_code');
}
