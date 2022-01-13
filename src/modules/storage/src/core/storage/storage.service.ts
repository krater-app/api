export interface StorageService {
  uploadTemporaryFile(fileStream: string | Buffer, fileName: string): Promise<void>;

  isTemporaryFileExists(fileName: string): Promise<boolean>;
}
