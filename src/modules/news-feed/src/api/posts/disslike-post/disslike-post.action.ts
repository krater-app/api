import { DisslikePostCommand } from '@app/commands/disslike-post/disslike-post.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const disslikePostActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /posts/{id}/disslike:
 *   patch:
 *     tags:
 *        - Posts
 *     summary:
 *       This endpoint allows to disslike selected post.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     responses:
 *       204:
 *        description: Post dissliked successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const disslikePostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new DisslikePostCommand({
          accountId: res.locals.accountId,
          postId: req.params.id,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default disslikePostAction;
