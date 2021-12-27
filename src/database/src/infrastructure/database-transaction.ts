import { Knex } from 'knex';

export interface DatabaseTransaction extends Knex.Transaction {}
