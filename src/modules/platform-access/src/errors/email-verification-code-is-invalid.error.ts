import { AppError } from '@krater/building-blocks';

export class EmailVerificationCodeIsInvalidError extends AppError {
  constructor(message = 'Provided email verification code is invalid for your account.') {
    super(message, 'EmailVerificationCodeIsInvalidError', 403);
  }
}
