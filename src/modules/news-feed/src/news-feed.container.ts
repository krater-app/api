import { NewsFeedController } from '@api/news-feed/news-feed.controller';
import { CreateNewTextPostCommandHandler } from '@app/commands/create-new-text-post/create-new-text-post.command-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { NewTextPostCreatedSubscriber } from '@app/subscribers/new-text-post-created/new-text-post-created.subscriber';
import { TextPostRepositoryImpl } from '@infrastructure/text-post/text-post.repository';
import { ContainerBuilder } from '@krater/building-blocks';
import { KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';

export const newsFeedContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(CreateNewTextPostCommandHandler).singleton()])
    .setControllers([asClass(NewsFeedController).singleton()])
    .setQueryHandlers([])
    .setRepositories([asClass(TextPostRepositoryImpl).singleton()])
    .setSubscribers([
      asClass(NewAccountRegisteredSubscriber).singleton(),
      asClass(NewTextPostCreatedSubscriber).singleton(),
    ])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork),
    })
    .build();
};
