import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';
import { KnexUnitOfWork } from '@krater/database';

export const fileSystemContainer = () =>
  new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setControllers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).singleton(),
    })
    .build();
