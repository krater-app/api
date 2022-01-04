import { UnitOfWorkRepository } from '@krater/database';
import { AccountRegistration } from './account-registration.aggregate-root';

export interface AccountRegistrationRepository extends UnitOfWorkRepository {
  insert(accountRegistration: AccountRegistration): Promise<void>;

  findByEmail(email: string): Promise<AccountRegistration | null>;

  findById(id: string): Promise<AccountRegistration | null>;

  update(accountRegistration: AccountRegistration): Promise<void>;
}
