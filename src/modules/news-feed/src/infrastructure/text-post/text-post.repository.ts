import { TextPost } from '@core/post-creation/text-post/text-post.aggregate-root';
import { TextPostRepository } from '@core/post-creation/text-post/text-post.repository';
import { PostTypeValue } from '@core/shared-kernel/post-type/post-type.value-object';
import { TableNames } from '@infrastructure/table-names';
import { DatabaseTransaction, QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class TextPostRepositoryImpl implements TextPostRepository {
  public readonly name = 'textPostRepository';

  private currentTransaction: DatabaseTransaction | null = null;

  constructor(private readonly dependencies: Dependencies) {}

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

  public async update(textPost: TextPost): Promise<void> {
    await Promise.all([
      this.currentTransaction
        .update({
          title: textPost.getTitle(),
          nsfw: textPost.isNsfw(),
          updated_at: new Date().toISOString(),
        })
        .where('id', textPost.getId())
        .into(TableNames.Post),
      this.currentTransaction
        .update({
          title: textPost.getTitle(),
          content: textPost.getContent(),
          tags: textPost.getTags(),
        })
        .where('id', textPost.getId())
        .into(TableNames.FeedItem),
    ]);
  }

  public async findById(id: string): Promise<TextPost | null> {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select([
        'post.id',
        'post.title',
        'textPost.content',
        'post.author_id AS authorId',
        'post.status',
        'post.created_at AS createdAt',
        'post.updated_at AS updatedAt',
        'post.nsfw',
      ])
      .join({ textPost: TableNames.TextPost }, 'post.id', 'textPost.id')
      .where('post.id', id)
      .from({ post: TableNames.Post })
      .first();

    if (!result) {
      return null;
    }

    const tags = await queryBuilder
      .select(['tag.name'])
      .where('postTag.post_id', id)
      .pluck('tag.name')
      .join({ tag: TableNames.Tag }, 'tag.id', 'postTag.tag_id')
      .from({ postTag: TableNames.PostTag });

    return TextPost.fromPersistence({
      ...result,
      tags,
    });
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
