import { EmailVerificationCodeStatusNotSupportedError } from '@errors/email-verification-code-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum EmailVerificationCodeStatusValue {
  Active = 'Active',
  Archvied = 'Archived',
  Used = 'Used',
}

interface EmailVerificationCodeStatusProps {
  value: string;
}

export class EmailVerificationCodeStatus extends ValueObject<EmailVerificationCodeStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Active = new EmailVerificationCodeStatus(EmailVerificationCodeStatusValue.Active);

  public static Archvied = new EmailVerificationCodeStatus(
    EmailVerificationCodeStatusValue.Archvied,
  );

  public static Used = new EmailVerificationCodeStatus(EmailVerificationCodeStatusValue.Used);

  public static fromValue(value: string) {
    switch (value) {
      case EmailVerificationCodeStatusValue.Active:
        return this.Active;

      case EmailVerificationCodeStatusValue.Archvied:
        return this.Archvied;

      case EmailVerificationCodeStatusValue.Used:
        return this.Used;

      default:
        throw new EmailVerificationCodeStatusNotSupportedError();
    }
  }
}
