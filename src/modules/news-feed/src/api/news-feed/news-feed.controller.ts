import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { createTextPostActionValidation } from './create-text-post/create-text-post.action';

interface Dependencies {
  createTextPostAction: RequestHandler;
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
}

export class NewsFeedController implements Controller {
  public readonly route = '/news-feed';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter() {
    const router = Router();

    router.post('/text-post', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      createTextPostActionValidation,
      this.dependencies.createTextPostAction,
    ]);

    return router;
  }
}
