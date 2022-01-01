/* eslint-disable no-param-reassign */
import { TokenProviderService, UnauthorizedError } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  tokenProviderService: TokenProviderService;
}

export const authMiddleware =
  ({ tokenProviderService }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const token = req.headers['x-auth-token'] ? req.headers['x-auth-token'].slice(7) : null;

    if (!token) {
      throw new UnauthorizedError();
    }

    const { accountId } = tokenProviderService.verifyAndDecodeToken<{ accountId: string }>(
      token as string,
    );

    res.locals.accountId = accountId;

    next();
  };
