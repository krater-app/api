import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { createTextPostActionValidation } from './create-text-post/create-text-post.action';
import { getFeedActionValidation } from './get-feed/get-feed.action';
import { publishPostActionValidation } from './publish-post/publish-post.action';

interface Dependencies {
  createTextPostAction: RequestHandler;
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  publishPostAction: RequestHandler;
  getFeedAction: RequestHandler;
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

    router.patch('/post/:id/publish', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      publishPostActionValidation,
      this.dependencies.publishPostAction,
    ]);

    router.get('/', [getFeedActionValidation, this.dependencies.getFeedAction]);

    return router;
  }
}
