import { ImageStatusNotSupportedError } from '@errors/image-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum ImageStatusValue {
  Temporary = 'Temporary',
  Persistent = 'Persistent',
}

interface ImageStatusProps {
  value: string;
}

export class ImageStatus extends ValueObject<ImageStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Temporary = new ImageStatus(ImageStatusValue.Temporary);

  public static Persistent = new ImageStatus(ImageStatusValue.Persistent);

  public static fromValue(value: string) {
    switch (value) {
      case ImageStatusValue.Temporary:
        return this.Temporary;

      case ImageStatusValue.Persistent:
        return this.Persistent;

      default:
        throw new ImageStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
