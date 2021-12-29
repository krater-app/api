import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';

export class EmailVerificationCodeProviderServiceImpl
  implements EmailVerificationCodeProviderService
{
  public generateVerificationCode(length = 4): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length)
      .toUpperCase();
  }
}
