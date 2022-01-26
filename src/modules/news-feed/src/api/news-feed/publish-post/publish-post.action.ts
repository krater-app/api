import { PublishPostCommand } from '@app/commands/publish-post/publish-post.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const publishPostActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /news-feed/post/{id}/publish:
 *   patch:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint allows to publish existing post by its owner.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *       204:
 *        description: Post published successfully
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       403:
 *         description: Unauthenticated
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const publishPostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new PublishPostCommand({
          accountId: res.locals.accountId,
          postId: req.params.id,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default publishPostAction;
