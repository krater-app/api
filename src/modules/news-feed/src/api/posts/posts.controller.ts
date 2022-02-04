import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { clearPostRatingActionValidation } from './clear-post-rating/clear-post-rating.action';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  clearPostRatingAction: RequestHandler;
}

export class PostsController implements Controller {
  public readonly route = '/posts';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.delete('/:id/like', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      clearPostRatingActionValidation,
      this.dependencies.clearPostRatingAction,
    ]);

    return router;
  }
}
