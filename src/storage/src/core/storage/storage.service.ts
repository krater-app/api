export interface StorageService {
  uploadTemporaryFile(fileStream: string | Buffer, fileName: string): Promise<void>;

  isTemporaryFileExists(fileName: string): Promise<boolean>;

  getPrivateFileUrl(fileName: string): string;

  getPublicFileUrl(fileName: string): string;

  getTemporaryFileUrl(fileName: string): string;
}
