import { AccountRegistration } from './account-registration.aggregate-root';

export interface AccountRegistrationRepository {
  insert(accountRegistration: AccountRegistration): Promise<void>;

  findByEmail(email: string): Promise<AccountRegistration | null>;
}
