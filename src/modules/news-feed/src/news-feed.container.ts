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

export const newsFeedContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([
      asClass(CreateNewTextPostCommandHandler).singleton(),
      asClass(PublishPostCommandHandler).singleton(),
    ])
    .setControllers([asClass(NewsFeedController).singleton()])
    .setQueryHandlers([asClass(GetFeedQueryHandler).singleton()])
    .setRepositories([
      asClass(TextPostRepositoryImpl).singleton(),
      asClass(ManageablePostRepositoryImpl).singleton(),
    ])
    .setSubscribers([
      asClass(NewAccountRegisteredSubscriber).singleton(),
      asClass(NewTextPostCreatedSubscriber).singleton(),
    ])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).singleton(),
    })
    .build();
};
