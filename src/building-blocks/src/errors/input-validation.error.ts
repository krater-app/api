import { AppError } from '@errors/app.error';

export class InputValidationError extends AppError {
  constructor(message = 'Input Validation Error.') {
    super(message, 'InputValidationError', 422);
  }
}
