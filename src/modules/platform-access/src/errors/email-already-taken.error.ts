import { AppError } from '@krater/building-blocks';

export class EmailAlreadyTakenError extends AppError {
  constructor(message = 'Provided email is already taken.') {
    super(message, 'EmailAlreadyTakenError', 400);
  }
}
