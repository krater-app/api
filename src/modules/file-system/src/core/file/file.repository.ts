import { File } from '@core/file/file.entity';
import { UnitOfWorkRepository } from '@krater/database';

export interface FileRepository extends UnitOfWorkRepository {
  insert(file: File): Promise<void>;
}
