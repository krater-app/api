import { TextPost } from '@core/text-post/text-post.aggregate-root';
import { TextPostRepository } from '@core/text-post/text-post.repository';
import { CommandHandler, EventDispatcher } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { CreateNewTextPostCommand } from './create-new-text-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class CreateNewTextPostCommandHandler implements CommandHandler<CreateNewTextPostCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: CreateNewTextPostCommand): Promise<void> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    const textPostRepository = unitOfWork.getRepository<TextPostRepository>('textPostRepository');

    await unitOfWork.complete(async () => {
      const textPost = TextPost.createNew(command.payload);

      await eventDispatcher.dispatchEventsForAggregate(textPost, unitOfWork);

      await textPostRepository.insert(textPost);
    });
  }
}
