import { LoginCommand } from '@app/commands/login/login.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const loginActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      nickname: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /account/login:
 *   post:
 *     tags:
 *        - Platform Access
 *     summary:
 *       This endpoint allows to login to the platform.
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
 *              password:
 *                type: string
 *                required: true
 *                example: mySecretPass123
 *     responses:
 *       200:
 *        description: Logged in successfully 😎.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                  required: true
 *                  example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJhMWVkODU4ZS0wN2M1LTQ0NjEtYTVkZS1hZDFmNWExMTE4NWEiLCJpYXQiOjE2NDA4ODc4OTEsImV4cCI6MTY0MDg5MTQ5MX0.jLdSus3p6lZglKXvJHXURNByRSZkmCR2XoJBHajTWJ8
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const loginAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(new LoginCommand(req.body))
      .then((tokens) => res.status(200).json(tokens))
      .catch(next);

export default loginAction;
