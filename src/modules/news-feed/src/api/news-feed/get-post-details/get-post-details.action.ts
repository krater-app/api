import { GetPostDetailsQuery } from '@app/queries/get-post-details/get-post-details.query';
import { QueryBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

export const getPostDetailsActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /news-feed/post-details/{id}:
 *   get:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint fetches selected post details.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *       200:
 *        description: Post details fetched successfully.
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const getPostDetailsAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetPostDetailsQuery({
          accountId: res.locals.accountId,
          postId: req.params.id,
        }),
      )
      .then((result) => res.status(200).json(result))
      .catch(next);

export default getPostDetailsAction;
