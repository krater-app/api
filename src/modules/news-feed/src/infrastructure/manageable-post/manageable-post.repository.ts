import { ManageablePost } from '@core/post-management/manageable-post/manageable-post.aggregate-root';
import { ManageablePostRepository } from '@core/post-management/manageable-post/manageable-post.repository';
import { PostRatingTypeValue } from '@core/shared-kernel/post-rating-type/post-rating-type.value-object';
import { TableNames } from '@infrastructure/table-names';
import { UniqueEntityID } from '@krater/building-blocks';
import { DatabaseTransaction, QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class ManageablePostRepositoryImpl implements ManageablePostRepository {
  public readonly name = 'manageablePostRepository';

  constructor(private readonly dependencies: Dependencies) {}

  private currentTransaction: DatabaseTransaction | null;

  public async findById(id: string): Promise<ManageablePost | null> {
    const result = await this.dependencies.queryBuilder
      .select(['id', 'status', 'author_id AS postAuthorId'])
      .from(TableNames.Post)
      .where('id', id)
      .first();

    if (!result) {
      return null;
    }

    const tagIDs = await this.dependencies.queryBuilder
      .select(['tag_id'])
      .pluck('tag_id')
      .where('post_id', id)
      .from(TableNames.PostTag);

    const tags = await this.dependencies.queryBuilder
      .select(['tag.name'])
      .pluck('tag.name')
      .join({ postTag: TableNames.PostTag }, 'tag.id', 'postTag.tag_id')
      .from({ tag: TableNames.Tag })
      .whereIn('tag.id', tagIDs);

    const likedUserIDs = await this.dependencies.queryBuilder
      .select(['account_id'])
      .pluck('account_id')
      .where('post_id', id)
      .andWhere('rating_type', PostRatingTypeValue.Like)
      .from(TableNames.PostRating);

    return ManageablePost.fromPersistence({
      ...result,
      likedUserIDs,
      tags,
    });
  }

  public async update(manageablePost: ManageablePost): Promise<void> {
    await this.currentTransaction
      .update({
        status: manageablePost.getStatus().getValue(),
      })
      .where('id', manageablePost.getId())
      .into(TableNames.Post);

    const likesToAdd = manageablePost.getLikedUserIDsToPersist().map((accountId) => ({
      id: new UniqueEntityID().value,
      post_id: manageablePost.getId(),
      account_id: accountId,
      created_at: new Date().toISOString(),
      rating_type: PostRatingTypeValue.Like,
    }));

    if (!likesToAdd.length) {
      return;
    }

    await this.currentTransaction.insert(likesToAdd).into(TableNames.PostRating);
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
