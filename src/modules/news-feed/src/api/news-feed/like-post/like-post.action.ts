import { LikePostCommand } from '@app/commands/like-post/like-post.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const likePostActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /news-feed/post/{id}/like:
 *   patch:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint allows to like selected post.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     responses:
 *       204:
 *        description: Post liked successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const likePostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new LikePostCommand({
          accountId: res.locals.accountId,
          postId: req.params.id,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default likePostAction;
