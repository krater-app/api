import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { clearPostRatingActionValidation } from './clear-post-rating/clear-post-rating.action';
import { disslikePostActionValidation } from './disslike-post/disslike-post.action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  clearPostRatingAction: RequestHandler;
  disslikePostAction: RequestHandler;
}

export class PostsController implements Controller {
  public readonly route = '/posts';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.patch('/:id/disslike', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      disslikePostActionValidation,
      this.dependencies.disslikePostAction,
    ]);

    router.delete('/:id/like', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      clearPostRatingActionValidation,
      this.dependencies.clearPostRatingAction,
    ]);

    return router;
  }
}
