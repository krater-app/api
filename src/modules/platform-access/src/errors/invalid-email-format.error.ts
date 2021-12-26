import { AppError } from '@krater/building-blocks';

export class InvalidEmailFormatError extends AppError {
  constructor(message = 'Provided email format is invalid.') {
    super(message, 'InvalidEmailFormatError', 400);
  }
}
