import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { createTextPostActionValidation } from './create-text-post/create-text-post.action';
import { editTextPostActionValidation } from './edit-text-post/edit-text-post.action';
import { getFeedActionValidation } from './get-feed/get-feed.action';
import { getPostDetailsActionValidation } from './get-post-details/get-post-details.action';
import { likePostActionValidation } from './like-post/like-post.action';
import { publishPostActionValidation } from './publish-post/publish-post.action';

interface Dependencies {
  createTextPostAction: RequestHandler;
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  publishPostAction: RequestHandler;
  getFeedAction: RequestHandler;
  getTagsAction: RequestHandler;
  getPostDetailsAction: RequestHandler;
  editTextPostAction: RequestHandler;
  likePostAction: RequestHandler;
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

    router.get('/tags', [this.dependencies.getTagsAction]);

    router.get('/post-details/:id', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      getPostDetailsActionValidation,
      this.dependencies.getPostDetailsAction,
    ]);

    router.patch('/text-post/:id', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      editTextPostActionValidation,
      this.dependencies.editTextPostAction,
    ]);

    router.patch('/post/:id/like', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      likePostActionValidation,
      this.dependencies.likePostAction,
    ]);

    return router;
  }
}
