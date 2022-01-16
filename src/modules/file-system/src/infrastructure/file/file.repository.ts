import { File } from '@core/file/file.entity';
import { FileRepository } from '@core/file/file.repository';
import { TableNames } from '@infrastructure/table-names';
import { DatabaseTransaction } from '@krater/database';

export class FileRepositoryImpl implements FileRepository {
  public readonly name = 'fileRepository';

  private currentTransaction: DatabaseTransaction | null = null;

  public async insert(file: File): Promise<void> {
    await this.currentTransaction
      .insert({
        id: file.getId(),
        name: file.getName(),
        path: file.getPath(),
        uploaded_at: file.getUploadedAt().toISOString(),
        author_id: file.getAuthorId(),
        status: file.getStatus(),
      })
      .into(TableNames.File);
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
