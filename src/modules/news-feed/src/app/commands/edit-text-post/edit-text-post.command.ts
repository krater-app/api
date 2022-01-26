import { Command } from '@krater/building-blocks';
import { EditTextPostDTO } from '@root/dtos/edit-text-post.dto';

interface Payload extends EditTextPostDTO {
  postId: string;
}

export class EditTextPostCommand implements Command<Payload> {
  constructor(public readonly payload: Payload) {}
}
