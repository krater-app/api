import { ImageStatus } from '@core/shared-kernel/image-status/image-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';
import { StorageService } from '@krater/storage';
import { TemporaryFileMustExistInBucketRule } from './rules/temporary-file-must-exist-in-bucket.rule';

interface ImageProps {
  status: ImageStatus;
}

export interface PersistedImage {
  id: string;
  status: string;
}

export class Image extends Entity<ImageProps> {
  private constructor(props: ImageProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async fromTemporaryBucket(imageId: string, storageService: StorageService) {
    await Image.checkRule(new TemporaryFileMustExistInBucketRule(imageId, storageService));

    return new Image(
      {
        status: ImageStatus.Temporary,
      },
      new UniqueEntityID(imageId),
    );
  }

  public static fromPersistence({ id, status }: PersistedImage) {
    return new Image(
      {
        status: ImageStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public getStatus() {
    return this.props.status.getValue();
  }
}
