import { AppError } from '@krater/building-blocks';

export class PasswordNotStrongEnoughError extends AppError {
  constructor(message = 'Provided password is not strong enough.') {
    super(message, 'PasswordNotStrongEnoughError', 400);
  }
}
