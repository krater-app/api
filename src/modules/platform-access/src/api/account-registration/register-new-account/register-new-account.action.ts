import { RegisterNewAccountCommand } from '@app/commands/register-new-account/register-new-account.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const registerNewAccountActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      nickname: Joi.string().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /account-registration:
 *   post:
 *     tags:
 *        - Plaftorm Access
 *     summary:
 *       This endpoint allows to register new account on the platform.
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                required: true
 *                example: Johnny21
 *              email:
 *                type: string
 *                format: email
 *                required: true
 *                example: john@gmail.com
 *              password:
 *                type: string
 *                required: true
 *                example: mySecretPass123
 *     responses:
 *       201:
 *        description: Account registered successfully.
 *       400:
 *        description: Business Rule Error
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const registerNewAccountAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new RegisterNewAccountCommand(req.body))
      .then(() => res.sendStatus(201))
      .catch(next);

export default registerNewAccountAction;
