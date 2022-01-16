import { AppError } from '@krater/building-blocks';

export class PostTypeNotSupportedError extends AppError {
  constructor(message = 'Provided Post Type is not supported.') {
    super(message, 'PostTypeNotSupportedError', 422);
  }
}
