import { TextPost } from './text-post.aggregate-root';

export interface TextPostRepository {
  insert(textPost: TextPost): Promise<void>;
}
