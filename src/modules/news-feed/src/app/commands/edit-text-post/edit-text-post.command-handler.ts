import { TextPostRepository } from '@core/post-creation/text-post/text-post.repository';
import { CommandHandler, NotFoundError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { TextPostDTO, textPostToTextPostDTO } from '@root/dtos/text-post.dto';
import { EditTextPostCommand } from './edit-text-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
}

export class EditTextPostCommandHandler
  implements CommandHandler<EditTextPostCommand, TextPostDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({
    payload: { postId, ...payload },
  }: EditTextPostCommand): Promise<TextPostDTO> {
    const { unitOfWork } = this.dependencies;

    await unitOfWork.start();

    const repository = unitOfWork.getRepository<TextPostRepository>('textPostRepository');

    return unitOfWork.complete(async () => {
      const textPost = await repository.findById(postId);

      if (!textPost) {
        throw new NotFoundError('Post with provided id does not exist.');
      }

      textPost.edit(payload);

      await repository.update(textPost);

      return textPostToTextPostDTO(textPost);
    });
  }
}
