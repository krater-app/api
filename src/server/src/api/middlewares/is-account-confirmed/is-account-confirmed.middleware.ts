import { UnauthorizedError } from '@krater/building-blocks';
import { QueryBuilder } from '@krater/database';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export const isAccountConfirmedMiddleware =
  ({ queryBuilder }: Dependencies): RequestHandler =>
  async (_, res, next) => {
    if (!res.locals.accountId) {
      throw new UnauthorizedError();
    }

    const result = await queryBuilder
      .select('id')
      .where('id', res.locals.userId)
      .andWhere('status', 'EmailConfirmed')
      .from('platform_access.account')
      .first();

    if (!result) {
      throw new UnauthorizedError();
    }

    next();
  };
