import { ConfirmEmailAddressCommand } from '@app/commands/confirm-email-address/confirm-email-address.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const confirmEmailAddressActionValidation = celebrate({
  [Segments.BODY]: {
    verificationCode: Joi.string().required(),
  },
});

/**
 * @swagger
 *
 * /account-registration/confirm-email:
 *   patch:
 *     tags:
 *        - Plaftorm Access
 *     security:
 *       - bearerAuth: []
 *     summary:
 *       This endpoint allows to confirm account address email.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              verificationCode:
 *                type: string
 *                required: true
 *                example: KVP77V
 *     responses:
 *       204:
 *        description: Account email address verified successfully.
 *       400:
 *        description: Business Rule Error
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const confirmEmailAddressAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new ConfirmEmailAddressCommand({
          accountId: res.locals.accountId,
          activationCode: req.body.verificationCode,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default confirmEmailAddressAction;
