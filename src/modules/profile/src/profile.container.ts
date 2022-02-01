import { KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';
import { GetUserPublicProfileQueryHandler } from '@app/queries/get-user-public-profile/get-user-public-profile.query-handler';
import { ProfileController } from '@api/profile/profile.controller';

export const profileContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([])
    .setQueryHandlers([asClass(GetUserPublicProfileQueryHandler).singleton()])
    .setControllers([asClass(ProfileController).singleton()])
    .setRepositories([])
    .setSubscribers([])
    .setCustom({
      unitOfWork: asClass(KnexUnitOfWork).transient(),
    })
    .build();
};
