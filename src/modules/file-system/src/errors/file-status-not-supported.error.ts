import { AppError } from '@krater/building-blocks';

export class FileStatusNotSupportedError extends AppError {
  constructor(message = 'Provided File Status is not supported.') {
    super(message, 'FileStatusNotSupportedError', 422);
  }
}
