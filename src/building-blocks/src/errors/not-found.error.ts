import { AppError } from '@errors/app.error';

export class NotFoundError extends AppError {
  constructor(message = 'Not Found.') {
    super(message, 'NotFoundError', 422);
  }
}
