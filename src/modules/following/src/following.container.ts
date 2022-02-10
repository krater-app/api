import { KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';

export const followingContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setControllers([])
    .setRepositories([])
    .setSubscribers([])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).transient(),
    })
    .build();
};
