import { BusinessRule } from '@krater/building-blocks';
import { AccountEmailCheckerService } from '../account-email-checker.service';

export class EmailMustBeUniqueRule implements BusinessRule {
  message = 'Provided email is already taken.';

  constructor(
    private readonly email: string,
    private readonly accountEmailCheckerService: AccountEmailCheckerService,
  ) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.accountEmailCheckerService.isUnique(this.email));
  }
}
