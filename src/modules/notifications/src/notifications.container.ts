import { asClass } from 'awilix';
import { ContainerBuilder } from '@krater/building-blocks';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { MailhogMailerService } from '@infrastructure/mailer/mailhog-mailer.service';
import { KnexUnitOfWork } from '@krater/database';
import { VerificationEmailSentAgainSubscriber } from '@app/subscribers/verification-email-sent-again/verification-email-sent-again.subscriber';

export const notificationsContainer = () => {
  return new ContainerBuilder()
    .setCommandHandlers([])
    .setQueryHandlers([])
    .setSubscribers([
      asClass(NewAccountRegisteredSubscriber).singleton(),
      asClass(VerificationEmailSentAgainSubscriber).singleton(),
    ])
    .setRepositories([])
    .setControllers([])
    .setCustom({
      mailerService: asClass(MailhogMailerService).singleton(),
      unitOfWork: asClass(KnexUnitOfWork).transient(),
    })
    .build();
};
