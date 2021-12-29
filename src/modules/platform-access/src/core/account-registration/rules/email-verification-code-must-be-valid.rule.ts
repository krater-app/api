import { EmailVerificationCodeStatus } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { EmailVerificationCode } from '@core/email-verification-code/email-verification-code.entity';
import { BusinessRule } from '@krater/building-blocks';

export class EmailVerificationCodeMustBeValidRule implements BusinessRule {
  message = 'Provided email verification code is already used or is invalid for your account.';

  constructor(
    private readonly verificationCode: string,
    private readonly verificationCodes: EmailVerificationCode[],
  ) {}

  public isBroken(): boolean {
    const verificationCode = this.verificationCodes.find(
      (code) => code.getCode() === this.verificationCode,
    );

    if (!verificationCode) {
      return true;
    }

    return !verificationCode.getStatus().equals(EmailVerificationCodeStatus.Active);
  }
}
