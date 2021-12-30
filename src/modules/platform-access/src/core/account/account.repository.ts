import { Account } from './account.aggregate-root';

export interface AccountRepository {
  findByEmail(email: string): Promise<Account | null>;
}
