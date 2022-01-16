import { CommandBus, InputValidationError } from '@krater/building-blocks';
import { RequestHandler } from 'express';
import { Joi } from 'celebrate';
import { UploadNewFileCommand } from '@app/commands/upload-new-file/upload-new-file.command';
import { UploadedFile } from 'express-fileupload';

interface Dependencies {
  commandBus: CommandBus;
}

export const uploadNewFileActionValidation: RequestHandler = async (req, _, next) => {
  if (!req.files) {
    return next(new InputValidationError('File is not provided.'));
  }

  try {
    await Joi.object({
      name: Joi.string().trim().required(),
      data: Joi.binary().required(),
    })
      .unknown(true)
      .validateAsync(req.files.file, { abortEarly: false });

    next();
  } catch (error) {
    return next(error);
  }
};

/**
 * @swagger
 *
 * /file-system/upload-file:
 *   post:
 *     tags:
 *       - File System
 *     security:
 *      - bearerAuth: []
 *     summary: Uploads new file
 *     requestBody:
 *       content:
 *        multipart/form-data:
 *         schema:
 *          type: object
 *          properties:
 *           file:
 *            type: string
 *            format: binary
 *     responses:
 *       201:
 *        description: File uploaded successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                url:
 *                  type: string
 *                path:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       400:
 *        description: File is not supported or invalid file extension
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const uploadNewFileAction =
  ({ commandBus }: Dependencies): RequestHandler =>
  (req, res, next) =>
    commandBus
      .handle(
        new UploadNewFileCommand({
          accountId: res.locals.accountId,
          file: req.files.file as Omit<UploadedFile, 'mv'>,
        }),
      )
      .then((uploadedFileData) => res.status(201).json(uploadedFileData))
      .catch(next);

export default uploadNewFileAction;
