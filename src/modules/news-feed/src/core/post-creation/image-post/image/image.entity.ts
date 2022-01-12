import { ImageStatus } from '@core/shared-kernel/image-status/image-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';

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

  public static fromTemporaryBucket(imageId: string) {
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
