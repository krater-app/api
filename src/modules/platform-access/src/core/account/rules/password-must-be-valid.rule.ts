import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { BusinessRule } from '@krater/building-blocks';

export class PasswordMustBeValidRule implements BusinessRule {
  message = 'Unauthorized.';

  constructor(
    private readonly accountPassword: AccountPassword,
    private readonly password: string,
    private readonly passwordHashProviderService: PasswordHashProviderService,
  ) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.accountPassword.isValid(this.password, this.passwordHashProviderService));
  }
}
