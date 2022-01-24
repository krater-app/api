import { GetTagsQuery } from '@app/queries/get-tags/get-tags.query';
import { QueryBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

export const getTagsActionValidation = celebrate({
  [Segments.QUERY]: {
    searchString: Joi.string().default(''),
    page: Joi.number().default(1),
    limit: Joi.number().default(20),
  },
});

/**
 * @swagger
 *
 * /news-feed/tags:
 *   get:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint fetches tags in paginated manner.
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
 *      - in: query
 *        name: searchString
 *        example: #program
 *     responses:
 *       200:
 *        description: Tags fetched successfully
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const getTagsAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetTagsQuery({
          searchString: req.query.searchString as string,
          limit: req.query.limit && Number(req.query.limit),
          page: req.query.page && Number(req.query.page),
        }),
      )
      .then((result) => res.status(200).json(result))
      .catch(next);

export default getTagsAction;
