import { Command } from '@krater/building-blocks';
import { UploadNewFileDTO } from '@root/dtos/upload-new-file.dto';

export class UploadNewFileCommand implements Command<UploadNewFileDTO> {
  constructor(public readonly payload: UploadNewFileDTO) {}
}
