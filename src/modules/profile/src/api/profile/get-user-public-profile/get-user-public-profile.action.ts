import { GetUserPublicProfileQuery } from '@app/queries/get-user-public-profile/get-user-public-profile.query';
import { QueryBus } from '@krater/building-blocks';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

export const getUserPublicProfileActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

/**
 * @swagger
 *
 * /profile/public/{id}:
 *   get:
 *     tags:
 *        - Profile
 *     summary:
 *       This endpoint allows to fetch public data for selected user.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     responses:
 *       200:
 *        description: Public user data fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  required: true
 *                  example: 79600c4b-1fad-4f3f-a9d2-46b8505d0ead
 *                nickname:
 *                  type: string
 *                  required: true
 *                  example: Johnny
 *                joinedAt:
 *                  type: string
 *                  required: true
 *                  example: 2022-02-01T16:19:57.703Z
 *                postsCount:
 *                  type: number
 *                  required: true
 *                  example: 10
 *                commentsCount:
 *                  type: number
 *                  required: true
 *                  example: 21
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const getUserPublicProfileAction =
  ({ queryBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    queryBus
      .handle(
        new GetUserPublicProfileQuery({
          profileId: req.params.id,
        }),
      )
      .then((profile) => res.status(200).json(profile))
      .catch(next);

export default getUserPublicProfileAction;
