import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';

interface Dependencies {
  authMiddleware: RequestHandler;
  isAccountConfirmedMiddleware: RequestHandler;
  getUserPublicProfileAction: RequestHandler;
}

export class ProfileController implements Controller {
  public readonly route = '/profile';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/public/:id', [
      this.dependencies.authMiddleware,
      this.dependencies.isAccountConfirmedMiddleware,
      this.dependencies.getUserPublicProfileAction,
    ]);

    return router;
  }
}
