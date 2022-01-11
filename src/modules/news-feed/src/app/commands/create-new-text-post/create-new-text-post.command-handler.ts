import { TextPost } from '@core/post-creation/text-post/text-post.aggregate-root';
import { TextPostRepository } from '@core/post-creation/text-post/text-post.repository';
import { CommandHandler, EventDispatcher } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { TextPostDTO, textPostToTextPostDTO } from '@root/dtos/text-post.dto';
import { CreateNewTextPostCommand } from './create-new-text-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class CreateNewTextPostCommandHandler
  implements CommandHandler<CreateNewTextPostCommand, TextPostDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: CreateNewTextPostCommand): Promise<TextPostDTO> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    const textPostRepository = unitOfWork.getRepository<TextPostRepository>('textPostRepository');

    return unitOfWork.complete<TextPostDTO>(async () => {
      const textPost = TextPost.createNew(command.payload);

      await eventDispatcher.dispatchEventsForAggregate(textPost, unitOfWork);

      await textPostRepository.insert(textPost);

      return textPostToTextPostDTO(textPost);
    });
  }
}
