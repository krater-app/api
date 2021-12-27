import { AccountRegistrationController } from '@api/account-registration/account-registration.controller';
import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { ContainerBuilder } from '@krater/building-blocks';
import { asClass } from 'awilix';

export const platformAccessContainer = () => {
  const container = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([asClass(RegisterNewAccountCommandHandler).singleton()])
    .setQueryHandlers([])
    .setSubscribers([])
    .setControllers([asClass(AccountRegistrationController).singleton()])
    .build();

  return container;
};
