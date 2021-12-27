import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
}

export class AccountRegistrationController implements Controller {
  public readonly route = '/account-registration';

  constructor(private readonly dependencies: Dependencies) {}

  public getRouter() {
    const router = Router();

    router.post('/', [
      registerNewAccountActionValidation,
      this.dependencies.registerNewAccountAction,
    ]);

    return router;
  }
}
