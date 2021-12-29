import { NewAccountRegisteredEvent } from '@core/integration-events/new-account-registered.event';
import { EventSubscriber } from '@krater/building-blocks';
import { MailerService } from '@core/mailer/mailer.service';

interface Dependencies {
  mailerService: MailerService;
}

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  type = NewAccountRegisteredEvent.name;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: NewAccountRegisteredEvent) {
    await this.dependencies.mailerService.sendMail({
      payload: {
        link: 'https://google.com',
        activationCode: event.payload.emailVerificationCode,
      },
      subject: 'Welcome to Krater!',
      template: 'welcome',
      to: event.payload.accountEmail,
    });
  }
}
