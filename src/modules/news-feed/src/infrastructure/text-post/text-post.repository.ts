import { TextPost } from '@core/post-creation/text-post/text-post.aggregate-root';
import { TextPostRepository } from '@core/post-creation/text-post/text-post.repository';
import { PostTypeValue } from '@core/shared-kernel/post-type/post-type.value-object';
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
        author_id: textPost.getAuthorId(),
        status: textPost.getStatus().getValue(),
        created_at: textPost.getCreatedAt().toISOString(),
        updated_at: textPost.getUpdatedAt().toISOString(),
        nsfw: textPost.isNsfw(),
      })
      .into(TableNames.Post);

    await this.currentTransaction
      .insert({
        id: textPost.getId(),
        content: textPost.getContent(),
      })
      .into(TableNames.TextPost);

    const [author] = await this.currentTransaction
      .select(['nickname'])
      .pluck('nickname')
      .from(TableNames.PostAuthor)
      .where('id', textPost.getAuthorId());

    await this.currentTransaction
      .insert({
        id: textPost.getId(),
        title: textPost.getTitle(),
        content: textPost.getContent(),
        type: PostTypeValue.Text,
        tags: textPost.getTags(),
        created_at: textPost.getCreatedAt().toISOString(),
        created_by: author,
      })
      .into(TableNames.FeedItem);
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
