import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { loginActionValidation } from './login/login.action';

interface Dependencies {
  loginAction: RequestHandler;
}

export class AccountController implements Controller {
  public readonly route = '/account';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter(): Router {
    const router = Router();

    router.post('/login', [loginActionValidation, this.dependencies.loginAction]);

    return router;
  }
}
