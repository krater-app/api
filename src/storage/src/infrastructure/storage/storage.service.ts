import { StorageService } from '@core/storage/storage.service';
import S3 from 'aws-sdk/clients/s3';

export class AwsStorageService implements StorageService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      ...(process.env.NODE_ENV === 'development' && {
        endpoint: process.env.STORAGE_ENDPOINT,
      }),
      accessKeyId: process.env.STORAGE_ACCESS,
      secretAccessKey: process.env.STORAGE_SECRET,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  public async uploadTemporaryFile(fileStream: string | Buffer, fileName: string): Promise<void> {
    await this.uploadFile(fileStream, fileName);
  }

  private async uploadFile(fileStream: string | Buffer, fileName: string) {
    await this.s3
      .putObject({
        Bucket: process.env.TEMPORARY_BUCKET,
        Key: fileName,
        Body: fileStream,
      })
      .promise();
  }

  public async isTemporaryFileExists(fileName: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: process.env.TEMPORARY_BUCKET,
        Key: fileName,
      })
      .promise()
      .then(() => true)
      .catch((error) => {
        if (error.code === 'NotFound') {
          return false;
        }

        throw new Error(`Could not check if file ${fileName} exists`);
      });
  }
}
