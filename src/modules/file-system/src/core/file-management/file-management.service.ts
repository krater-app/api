import { UploadedFileDTO } from '@root/dtos/uploaded-file.dto';

export interface NewTemporaryFilePayload {
  fileStream: Buffer | string;
  fileName: string;
  accountId: string;
}

export interface FileManagementService {
  createNewTemporaryFile(payload: NewTemporaryFilePayload): Promise<UploadedFileDTO>;
}
