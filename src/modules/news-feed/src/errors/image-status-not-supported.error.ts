import { AppError } from '@krater/building-blocks';

export class ImageStatusNotSupportedError extends AppError {
  constructor(message = 'Provided Image Status is not supported.') {
    super(message, 'ImageStatusNotSupportedError', 422);
  }
}
