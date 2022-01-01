import { Controller } from '@krater/building-blocks';
import { RequestHandler, Router } from 'express';
import { confirmEmailAddressActionValidation } from './confirm-email-address/confirm-email-address.action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.action';

interface Dependencies {
  registerNewAccountAction: RequestHandler;
  authMiddleware: RequestHandler;
  confirmEmailAddressAction: RequestHandler;
  resendConfirmationEmailAction: RequestHandler;
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

    router.patch('/confirm-email', [
      this.dependencies.authMiddleware,
      confirmEmailAddressActionValidation,
      this.dependencies.confirmEmailAddressAction,
    ]);

    router.patch('/resend-confirmation-email', [
      this.dependencies.authMiddleware,
      this.dependencies.resendConfirmationEmailAction,
    ]);

    return router;
  }
}
