import { ManageablePostRepository } from '@core/post-management/manageable-post/manageable-post.repository';
import { CommandHandler, EventDispatcher, UnauthenticatedError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { PublishPostCommand } from './publish-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class PublishPostCommandHandler implements CommandHandler<PublishPostCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: PublishPostCommand): Promise<void> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    await unitOfWork.complete(async () => {
      const repository = unitOfWork.getRepository<ManageablePostRepository>(
        'manageablePostRepository',
      );

      const post = await repository.findById(command.payload.postId);

      if (!post) {
        throw new UnauthenticatedError();
      }

      post.publish();

      await eventDispatcher.dispatchEventsForAggregate(post, unitOfWork);

      await repository.update(post);
    });
  }
}
