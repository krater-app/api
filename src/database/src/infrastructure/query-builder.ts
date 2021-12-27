import * as Knex from 'knex';

export interface QueryBuilder extends Knex.Knex {}

export type DatabaseClient = 'pg';

export interface DatabaseConfiguration {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export const createQueryBuilder = (client: DatabaseClient, config: DatabaseConfiguration) =>
  Knex.default({
    client,
    connection: config,
    pool: {
      min: 1,
      max: 10,
    },
  }) as QueryBuilder;
