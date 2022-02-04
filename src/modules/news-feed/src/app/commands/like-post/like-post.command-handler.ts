import { ManageablePostRepository } from '@core/post-management/manageable-post/manageable-post.repository';
import { CommandHandler, EventDispatcher } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { LikePostCommand } from './like-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class LikePostCommandHandler implements CommandHandler<LikePostCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: LikePostCommand): Promise<void> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    await unitOfWork.complete(async () => {
      const postRepository = unitOfWork.getRepository<ManageablePostRepository>(
        'manageablePostRepository',
      );

      const post = await postRepository.findById(command.payload.postId);

      post.like(command.payload.accountId);

      await eventDispatcher.dispatchEventsForAggregate(post, unitOfWork);

      await postRepository.update(post);
    });
  }
}
