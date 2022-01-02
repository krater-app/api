import { AppError } from '@krater/building-blocks';

export class PostStatusNotSupportedError extends AppError {
  constructor(message = 'Provided Post Status is not supported.') {
    super(message, 'PostStatusNotSupportedError', 422);
  }
}
