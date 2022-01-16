import { FileStatus } from '@core/file-status/file-status.value-object';
import { Entity, UniqueEntityID } from '@krater/building-blocks';

interface FileProps {
  name: string;
  authorId: UniqueEntityID;
  status: FileStatus;
  uploadedAt: Date;
}

export interface PersistedFile {
  id: string;
  authorId: string;
  status: string;
  uploadedAt: string;
}

export class File extends Entity<FileProps> {
  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew(name: string, authorId: string) {
    return new File({
      name,
      authorId: new UniqueEntityID(authorId),
      status: FileStatus.Temporary,
      uploadedAt: new Date(),
    });
  }

  public getId() {
    return this.id.value;
  }

  public getExtension() {
    return this.props.name.split('.').pop();
  }

  public getName() {
    return this.props.name;
  }

  public getPath() {
    return `${this.props.authorId.value}/${this.id.value}.${this.getExtension()}`;
  }

  public getStatus() {
    return this.props.status.getValue();
  }

  public getUploadedAt() {
    return this.props.uploadedAt;
  }

  public getAuthorId() {
    return this.props.authorId.value;
  }
}
