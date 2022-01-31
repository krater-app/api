import { GetAccountInformationQuery } from '@app/queries/get-account-information/get-account-information.query';
import { QueryBus } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

/**
 * @swagger
 *
 * /account:
 *   get:
 *     tags:
 *        - Platform Access
 *     summary:
 *       This endpoint returns data for logged in account.
 *     responses:
 *       200:
 *        description: Data fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  required: true
 *                  format: uuid
 *                nickname:
 *                  type: string
 *                  required: true
 *                  example: Johnny
 *                accountConfirmed:
 *                  type: boolean
 *                  required: true
 *                  example: true
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       403:
 *        description: Unauthenticated
 *       500:
 *         description: Internal Server Error
 */
const getAccountInformationAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (_, res, next) =>
    queryBus
      .handle(
        new GetAccountInformationQuery({
          accountId: res.locals.accountId,
        }),
      )
      .then((accountData) => res.status(200).json(accountData))
      .catch(next);

export default getAccountInformationAction;
