import { MailerService, SendMailPayload } from '@core/mailer/mailer.service';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { Logger } from '@krater/building-blocks';
import { Transporter, createTransport } from 'nodemailer';

interface Dependencies {
  logger: Logger;
}

export class MailhogMailerService implements MailerService {
  private transporter: Transporter;

  constructor(private readonly dependencies: Dependencies) {
    this.transporter = createTransport({
      host: process.env.MAILHOG_HOST,
      port: Number(process.env.SMTP_PORT),
    });
  }

  public async sendMail({
    from = process.env.SERVICE_MAIL,
    to,
    payload,
    subject,
    template: templateName,
  }: SendMailPayload): Promise<void> {
    const { logger } = this.dependencies;

    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, 'templates', `${templateName}.html`),
      'utf-8',
    );

    const template = Handlebars.compile(emailTemplateSource);

    const htmlToSend = template(payload);

    await this.transporter.sendMail({
      from,
      to,
      subject,
      html: htmlToSend,
    });

    logger.info(`[Mailer Service]: Email with subject: "${subject}" sent to "${to}".`);
  }
}
