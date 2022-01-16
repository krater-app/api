import { FileManagementServiceImpl } from '@infrastructure/file-management/file-management.service';
import { CommandHandler } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { StorageService } from '@krater/storage';
import { UploadedFileDTO } from '@root/dtos/uploaded-file.dto';
import { UploadNewFileCommand } from './upload-new-file.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  storageService: StorageService;
}

export class UploadNewFileCommandHandler
  implements CommandHandler<UploadNewFileCommand, UploadedFileDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: UploadNewFileCommand): Promise<UploadedFileDTO> {
    const fileManagementService = new FileManagementServiceImpl(this.dependencies);

    return fileManagementService.createNewTemporaryFile({
      accountId: command.payload.accountId,
      fileName: command.payload.file.name,
      fileStream: Buffer.from(command.payload.file.data),
    });
  }
}
