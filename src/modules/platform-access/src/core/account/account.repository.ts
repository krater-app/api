import { UnitOfWorkRepository } from '@krater/database';
import { Account } from './account.aggregate-root';

export interface AccountRepository extends UnitOfWorkRepository {
  findByEmail(email: string): Promise<Account | null>;

  findByNickname(nickname: string): Promise<Account | null>;

  findById(id: string): Promise<Account | null>;
}
