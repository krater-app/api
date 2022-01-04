import { ContainerBuilder } from '@krater/building-blocks';

export const newsFeedContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setControllers([])
    .setQueryHandlers([])
    .setRepositories([])
    .setSubscribers([])
    .build();
};