import { ResendConfirmationEmailCommand } from '@app/commands/resend-confirmation-email/resend-confirmation-email.command';
import { CommandBus } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

/**
 * @swagger
 *
 * /account-registration/resend-confirmation-email:
 *   patch:
 *     tags:
 *        - Plaftorm Access
 *     summary:
 *       This endpoint allows to resend confirmation email
 *     responses:
 *       204:
 *        description: Successfully email verification code resent
 *       400:
 *        description: Business Rule Error
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
export const resendConfirmationEmailAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new ResendConfirmationEmailCommand({
          accountId: res.locals.accountId,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default resendConfirmationEmailAction;
