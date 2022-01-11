import { Command } from '@krater/building-blocks';
import { PublishPostDTO } from '@root/dtos/publish-post.dto';

export class PublishPostCommand implements Command<PublishPostDTO> {
  constructor(public readonly payload: PublishPostDTO) {}
}
