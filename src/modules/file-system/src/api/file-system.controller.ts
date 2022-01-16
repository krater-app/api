import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import fileUpload from 'express-fileupload';
import { uploadNewFileActionValidation } from './upload-new-file/upload-new-file.action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  uploadNewFileAction: RequestHandler;
}

export class FileSystemController implements Controller {
  public readonly route = '/file-system';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/upload-file', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      fileUpload(),
      uploadNewFileActionValidation,
      this.dependencies.uploadNewFileAction,
    ]);

    return router;
  }
}
