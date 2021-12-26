import { AppError } from '@krater/building-blocks';

export class AccountStatusNotSupported extends AppError {
  constructor(message = 'Provided Account Status is not supported') {
    super(message, 'AccountStatusNotSupported', 422);
  }
}
