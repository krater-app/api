import { UnitOfWorkRepository } from '@krater/database';
import { ManageablePost } from './manageable-post.aggregate-root';

export interface ManageablePostRepository extends UnitOfWorkRepository {
  findById(id: string): Promise<ManageablePost | null>;

  update(manageablePost: ManageablePost): Promise<void>;
}
