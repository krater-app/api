import { TextPost } from '@core/text-post/text-post.aggregate-root';
import { TextPostRepository } from '@core/text-post/text-post.repository';
import { TableNames } from '@infrastructure/table-names';
import { DatabaseTransaction } from '@krater/database';

export class TextPostRepositoryImpl implements TextPostRepository {
  public readonly name = 'textPostRepository';

  private currentTransaction: DatabaseTransaction | null = null;

  public async insert(textPost: TextPost): Promise<void> {
    await this.currentTransaction
      .insert({
        id: textPost.getId(),
        title: textPost.getTitle(),
        content: textPost.getContent(),
        author_id: textPost.getAuthorId(),
        status: textPost.getStatus(),
        created_at: textPost.getCreatedAt().toISOString(),
        updated_at: textPost.getUpdatedAt().toISOString(),
        nsfw: textPost.isNsfw(),
      })
      .into(TableNames.TextPost);
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
