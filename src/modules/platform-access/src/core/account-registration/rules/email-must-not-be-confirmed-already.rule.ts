import { AccountStatus } from '@core/account-status/account-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class EmailMustNotBeConfrimedAlreadyRule implements BusinessRule {
  message = 'Email is already confirmed.';

  constructor(private readonly accountStatus: AccountStatus) {}

  public isBroken(): boolean | Promise<boolean> {
    return this.accountStatus.equals(AccountStatus.EmailConfirmed);
  }
}
