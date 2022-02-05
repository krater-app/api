import { ManageablePostRepository } from '@core/post-management/manageable-post/manageable-post.repository';
import { CommandHandler, EventDispatcher, NotFoundError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { DisslikePostCommand } from './disslike-post.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class DisslikePostCommandHandler implements CommandHandler<DisslikePostCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: DisslikePostCommand): Promise<void> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    await unitOfWork.complete(async () => {
      const postRepository = unitOfWork.getRepository<ManageablePostRepository>(
        'manageablePostRepository',
      );

      const post = await postRepository.findById(command.payload.postId);

      if (!post) {
        throw new NotFoundError('Post does not exist.');
      }

      post.disslike(command.payload.accountId);

      await eventDispatcher.dispatchEventsForAggregate(post, unitOfWork);
    });
  }
}
