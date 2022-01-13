import { BusinessRule } from '@krater/building-blocks';
import { StorageService } from '@krater/storage';

export class TemporaryFileMustExistInBucketRule implements BusinessRule {
  message = 'Provided file does not exist in our file system.';

  constructor(private readonly fileId: string, private readonly storageService: StorageService) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.storageService.isTemporaryFileExists(this.fileId));
  }
}
