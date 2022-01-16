import { UploadedFile } from 'express-fileupload';

export interface UploadNewFileDTO {
  accountId: string;
  file: Omit<UploadedFile, 'mv'>;
}
