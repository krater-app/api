import { GetFeedQuery } from '@app/queries/get-feed/get-feed.query';
import { QueryBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

export const getFeedActionValidation = celebrate(
  {
    [Segments.PARAMS]: {
      page: Joi.number().default(1),
      limit: Joi.number().default(20),
    },
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /news-feed:
 *   get:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint fetches posts in paginated manner.
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *          example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *          example: 20
 *     responses:
 *       200:
 *        description: Posts fetched successfully
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const getFeedAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetFeedQuery({
          page: req.query.page as unknown as number,
          limit: req.query.limit as unknown as number,
        }),
      )
      .then((result) => res.status(200).json(result))
      .catch(next);

export default getFeedAction;
