import { AppError } from '@krater/building-blocks';

export class EmailVerificationCodeStatusNotSupportedError extends AppError {
  constructor(message = 'Provided Email Verification Code Status is not supported.') {
    super(message, 'EmailVerificationCodeStatusNotSupportedError', 422);
  }
}
