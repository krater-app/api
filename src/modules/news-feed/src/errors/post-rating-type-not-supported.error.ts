import { AppError } from '@krater/building-blocks';

export class PostRatingTypeNotSupportedError extends AppError {
  constructor(message = 'Provided Post Rating Status is not supported.') {
    super(message, 'PostRatingTypeNotSupportedError', 422);
  }
}
