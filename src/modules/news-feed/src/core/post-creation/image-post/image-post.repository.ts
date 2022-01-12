import { UnitOfWorkRepository } from '@krater/database';
import { ImagePost } from './image-post.aggregate-root';

export interface ImagePostRepository extends UnitOfWorkRepository {
  insert(imagePost: ImagePost): Promise<void>;
}
