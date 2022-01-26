import { EditTextPostCommand } from '@app/commands/edit-text-post/edit-text-post.command';
import { CommandBus } from '@krater/building-blocks';
import { EditTextPostDTO } from '@root/dtos/edit-text-post.dto';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const editTextPostActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: Joi.object<EditTextPostDTO>().keys({
    title: Joi.string(),
    content: Joi.string(),
    tags: Joi.array().items(Joi.string().trim().required()),
    isNsfw: Joi.boolean(),
  }),
});

/**
 * @swagger
 *
 * /news-feed/text-post/{id}:
 *   patch:
 *     tags:
 *        - News Feed
 *     summary:
 *       This endpoint allows to edit text post.
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                required: false
 *                nullable: true
 *                example: Something weird happen... 🤨
 *              content:
 *                type: string
 *                format: email
 *                required: true
 *                example: Hi guys, something weird happen with my computer 💻. Can you help guys? 🙏
 *              isNsfw:
 *                type: boolean
 *                required: true
 *                example: false
 *              tags:
 *                type: array
 *                items:
 *                  type: string
 *                required: true
 *                example: ["#computer", "#help", "#programmer120k"]
 *     responses:
 *       201:
 *        description: Text post updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  required: true
 *                  example: 79600c4b-1fad-4f3f-a9d2-46b8505d0ead
 *                title:
 *                  type: string
 *                  required: true
 *                  example: Something weird happen... 🤨
 *                content:
 *                  type: string
 *                  required: true
 *                  example: Hi guys, something weird happen with my computer 💻. Can you help guys? 🙏
 *                authorId:
 *                  type: string
 *                  required: true
 *                  example: ff0455e2-e1e6-4923-b8d6-77bade53f5bb
 *                status:
 *                  type: string
 *                  required: true
 *                  example: Draft
 *                createdAt:
 *                  type: string
 *                  required: true
 *                  example: 2022-01-08T17:22:47.363Z
 *                updatedAt:
 *                  type: string
 *                  required: true
 *                  example: 2022-01-08T17:22:47.363Z
 *                tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                  required: true
 *                  example: ["#computer", "#help", "#programmer120k"]
 *                nsfw:
 *                  type: boolean
 *                  required: true
 *                  example: false
 *       400:
 *        description: Business Rule Error
 *       401:
 *        description: Unauthorized
 *       422:
 *        description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
const editTextPostAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new EditTextPostCommand({
          postId: req.params.id,
          accountId: res.locals.accountId,
          ...req.body,
        }),
      )
      .then((result) => res.status(200).json(result))
      .catch(next);

export default editTextPostAction;
