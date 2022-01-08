import { UnitOfWorkRepository } from '@krater/database';
import { TextPost } from './text-post.aggregate-root';

export interface TextPostRepository extends UnitOfWorkRepository {
  insert(textPost: TextPost): Promise<void>;
}
