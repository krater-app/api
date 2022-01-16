import {
  FileManagementService,
  NewTemporaryFilePayload,
} from '@core/file-management/file-management.service';
import { File } from '@core/file/file.entity';
import { FileRepository } from '@core/file/file.repository';
import { UnitOfWork } from '@krater/database';
import { StorageService } from '@krater/storage';
import { UploadedFileDTO } from '@root/dtos/uploaded-file.dto';

interface Dependencies {
  storageService: StorageService;
  unitOfWork: UnitOfWork;
}

export class FileManagementServiceImpl implements FileManagementService {
  constructor(private readonly dependencies: Dependencies) {}

  public async createNewTemporaryFile({
    accountId,
    fileName,
    fileStream,
  }: NewTemporaryFilePayload): Promise<UploadedFileDTO> {
    const { storageService, unitOfWork } = this.dependencies;

    await unitOfWork.start();

    return unitOfWork.complete(async () => {
      const file = File.createNew(fileName, accountId);

      const repository = unitOfWork.getRepository<FileRepository>('fileRepository');

      const filePath = `${accountId}/${file.getId()}.${file.getExtension()}`;

      await storageService.uploadTemporaryFile(fileStream, filePath);

      await repository.insert(file);

      return {
        path: filePath,
        url: storageService.getTemporaryFileUrl(filePath),
      };
    });
  }
}
