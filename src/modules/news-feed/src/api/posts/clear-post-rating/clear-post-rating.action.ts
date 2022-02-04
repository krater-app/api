import { ClearPostRatingCommand } from '@app/commands/clear-post-rating/clear-post-rating.command';
import { CommandBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const clearPostRatingActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /posts/{id}/like:
 *   delete:
 *     tags:
 *        - Posts
 *     summary:
 *       This endpoint allows to clear rating for selected post.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     responses:
 *       204:
 *        description: Post rating cleared out successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const clearPostRatingAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new ClearPostRatingCommand({
          accountId: res.locals.accountId,
          postId: req.params.id,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);

export default clearPostRatingAction;
