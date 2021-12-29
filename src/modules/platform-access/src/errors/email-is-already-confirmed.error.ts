import { AppError } from '@krater/building-blocks';

export class EmailIsAlreadyConfirmedError extends AppError {
  constructor(message = 'Email is already confirmed') {
    super(message, 'EmailIsAlreadyConfirmedError', 400);
  }
}
