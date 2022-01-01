import { MailerService } from '@core/mailer/mailer.service';
import { EventSubscriber } from '@krater/building-blocks';
import { VerificationEmailSentAgainEvent } from '@krater/integration-events';

interface Dependencies {
  mailerService: MailerService;
}

export class VerificationEmailSentAgainSubscriber
  implements EventSubscriber<VerificationEmailSentAgainEvent>
{
  type = VerificationEmailSentAgainEvent.name;

  constructor(private readonly dependencies: Dependencies) {}

  public async handle(event: VerificationEmailSentAgainEvent): Promise<void> {
    await this.dependencies.mailerService.sendMail({
      payload: {
        link: 'https://google.com',
        activationCode: event.payload.verificationCode,
      },
      subject: 'Welcome to Krater!',
      template: 'welcome',
      to: event.payload.accountEmail,
    });
  }
}
