import { FileStatusNotSupportedError } from '@errors/file-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum FileStatusValue {
  Temporary = 'Temporary',
  Persisted = 'Persisted',
}

interface FileStatusProps {
  value: string;
}

export class FileStatus extends ValueObject<FileStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Temporary = new FileStatus(FileStatusValue.Temporary);

  public static Persisted = new FileStatus(FileStatusValue.Persisted);

  public static fromValue(value: string) {
    switch (value) {
      case FileStatusValue.Temporary:
        return this.Temporary;

      case FileStatusValue.Persisted:
        return this.Persisted;

      default:
        throw new FileStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
