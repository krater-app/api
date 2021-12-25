import { AppError } from './app.error';

export class ResourceAlreadyExistsError extends AppError {
  constructor(message = 'Resource Already Exists.') {
    super(message, 'ResourceAlreadyExistsError', 409);
  }
}
