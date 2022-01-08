import { Command } from '@krater/building-blocks';
import { CreateNewTextPostDTO } from '@root/dtos/create-new-text-post.dto';

export class CreateNewTextPostCommand implements Command<CreateNewTextPostDTO> {
  constructor(public readonly payload: CreateNewTextPostDTO) {}
}
