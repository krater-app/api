import { GetTagsQueryHandler } from '@app/queries/get-tags/get-tags.query-handler';
import { NewsFeedController } from '@api/news-feed/news-feed.controller';
import { CreateNewTextPostCommandHandler } from '@app/commands/create-new-text-post/create-new-text-post.command-handler';
import { PublishPostCommandHandler } from '@app/commands/publish-post/publish-post.command-handler';
import { GetFeedQueryHandler } from '@app/queries/get-feed/get-feed.query-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { NewTextPostCreatedSubscriber } from '@app/subscribers/new-text-post-created/new-text-post-created.subscriber';
import { ManageablePostRepositoryImpl } from '@infrastructure/manageable-post/manageable-post.repository';
import { TextPostRepositoryImpl } from '@infrastructure/text-post/text-post.repository';
import { ContainerBuilder } from '@krater/building-blocks';
import { KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';
import { GetPostDetailsQueryHandler } from '@app/queries/get-post-details/get-post-details.query-handler';
import { EditTextPostCommandHandler } from '@app/commands/edit-text-post/edit-text-post.command-handler';
import { LikePostCommandHandler } from '@app/commands/like-post/like-post.command-handler';
import { PostLikedSubscriber } from '@app/subscribers/post-liked/post-liked.subscriber';
import { PostRatingClearedOutSubscriber } from '@app/subscribers/post-rating-cleared-out/post-rating-cleared-out.subscriber';
import { ClearPostRatingCommandHandler } from '@app/commands/clear-post-rating/clear-post-rating.command-handler';
import { PostsController } from '@api/posts/posts.controller';
import { DisslikePostCommandHandler } from '@app/commands/disslike-post/disslike-post.command-handler';
import { PostDisslikedSubscriber } from '@app/subscribers/post-dissliked/post-dissliked.subscriber';

export const newsFeedContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([
      asClass(CreateNewTextPostCommandHandler).singleton(),
      asClass(PublishPostCommandHandler).singleton(),
      asClass(EditTextPostCommandHandler).singleton(),
      asClass(LikePostCommandHandler).singleton(),
      asClass(ClearPostRatingCommandHandler).singleton(),
      asClass(DisslikePostCommandHandler).singleton(),
    ])
    .setControllers([asClass(NewsFeedController).singleton(), asClass(PostsController).singleton()])
    .setQueryHandlers([
      asClass(GetFeedQueryHandler).singleton(),
      asClass(GetTagsQueryHandler).singleton(),
      asClass(GetPostDetailsQueryHandler).singleton(),
    ])
    .setRepositories([
      asClass(TextPostRepositoryImpl).singleton(),
      asClass(ManageablePostRepositoryImpl).singleton(),
    ])
    .setSubscribers([
      asClass(NewAccountRegisteredSubscriber).singleton(),
      asClass(NewTextPostCreatedSubscriber).singleton(),
      asClass(PostLikedSubscriber).singleton(),
      asClass(PostRatingClearedOutSubscriber).singleton(),
      asClass(PostDisslikedSubscriber).singleton(),
    ])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).transient(),
    })
    .build();
};
