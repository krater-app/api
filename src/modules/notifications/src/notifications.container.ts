import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { MailhogMailerService } from '@infrastructure/mailer/mailhog-mailer.service';
import { KnexUnitOfWork } from '@krater/database';

export const notificationsContainer = () => {
  return new ContainerBuilder()
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .setRepositories([])
    .setControllers([])
    .setCustom({
      mailerService: asClass(MailhogMailerService).singleton(),
      unitOfWork: asClass(KnexUnitOfWork).singleton(),
    })
    .build();
};
