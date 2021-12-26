import { EmailAlreadyTakenError } from '@errors/email-already-taken.error';
import { InvalidEmailFormatError } from '@errors/invalid-email-format.error';
import { ValueObject } from '@krater/building-blocks';
import { AccountEmailCheckerService } from './account-email-checker.service';
import { EmailFormatMustBeValidRule } from './rules/email-format-must-be-valid.rule';
import { EmailMustBeUniqueRule } from './rules/email-must-be-unique.rule';

interface AccountEmailProps {
  localPart: string;
  domain: string;
}

export class AccountEmail extends ValueObject<AccountEmailProps> {
  private constructor(props: AccountEmailProps) {
    super(props);
  }

  public static async createNew(
    email: string,
    accountEmailCheckerService: AccountEmailCheckerService,
  ) {
    AccountEmail.checkRule(new EmailFormatMustBeValidRule(email), InvalidEmailFormatError);

    await AccountEmail.checkRule(
      new EmailMustBeUniqueRule(email, accountEmailCheckerService),
      EmailAlreadyTakenError,
    );

    return this.convertToEmailParts(email);
  }

  public static fromPersistence(email: string) {
    return this.convertToEmailParts(email);
  }

  private static convertToEmailParts(email: string) {
    const [localPart, domain] = email.split('@');

    return new AccountEmail({
      localPart,
      domain,
    });
  }

  public toString() {
    return `${this.props.localPart}@${this.props.domain}`;
  }
}
