import { RefreshTokenCommand } from '@app/commands/refresh-token/refresh-token.command';
import { CommandBus } from '@krater/building-blocks';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

/**
 * @swagger
 *
 * /account/refresh-token:
 *   post:
 *     tags:
 *       - Platform Access
 *     security: []
 *     summary: Refresh short live token
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *                required: true
 *                example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJlNDJkYWExMC1kZDNkLTRiYTAtYWQ3Zi0xNjEyMjgyYjY1YzgiLCJpYXQiOjE2NDMxMjA3NDEsImV4cCI6MTY0MzIwNzE0MX0.fWbmwMEwRbjefiRfoY67JMZUk6MXaKD6Yi4so0G0Kgg
 *     responses:
 *       200:
 *        description: Access token refreshed successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 * */
const refreshTokenAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new RefreshTokenCommand({
          refreshToken: req.body.refreshToken,
        }),
      )
      .then((response) => res.status(200).json(response))
      .catch(next);

export default refreshTokenAction;
