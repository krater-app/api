import { ContainerBuilder } from '@krater/building-blocks';
import { KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';

export const tagsContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setControllers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).transient(),
    })
    .build();
};
