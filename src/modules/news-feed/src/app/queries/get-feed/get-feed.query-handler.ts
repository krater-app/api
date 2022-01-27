import { PostStatusValue } from '@core/shared-kernel/post-status/post-status.value-object';
import { TableNames } from '@infrastructure/table-names';
import { QueryHandler, PaginatedResponse } from '@krater/building-blocks';
import { QueryBuilder, paginationToKnex } from '@krater/database';
import { StorageService } from '@krater/storage';
import { FeedPostItemDTO } from '@root/dtos/feed-post-item.dto';
import { GetFeedQuery } from './get-feed.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
  storageService: StorageService;
}

export class GetFeedQueryHandler
  implements QueryHandler<GetFeedQuery, PaginatedResponse<FeedPostItemDTO>>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: GetFeedQuery): Promise<PaginatedResponse<FeedPostItemDTO>> {
    const { start, limit } = paginationToKnex(query.payload.page, query.payload.limit);

    const total = await this.dependencies.queryBuilder
      .count('feedItem.id')
      .join(
        {
          post: TableNames.Post,
        },
        'post.id',
        'feedItem.id',
      )
      .where('post.status', PostStatusValue.Active)
      .from({ feedItem: TableNames.FeedItem })
      .first();

    const result = await this.dependencies.queryBuilder
      .select([
        'feedItem.id',
        'feedItem.title',
        'feedItem.content',
        'feedItem.description',
        'feedItem.image_path AS imagePath',
        'feedItem.likes',
        'feedItem.comments',
        'feedItem.type',
        'feedItem.created_by AS createdBy',
        'feedItem.created_at AS createdAt',
        'feedItem.tags',
      ])
      .offset(start)
      .limit(limit)
      .orderBy('feedItem.created_at', 'desc')
      .join(
        {
          post: TableNames.Post,
        },
        'post.id',
        'feedItem.id',
      )
      .where('post.status', PostStatusValue.Active)
      .from({ feedItem: TableNames.FeedItem });

    return {
      items: result.map((post) => ({
        ...post,
        comments: Number(post.comments),
        likes: Number(post.likes),
        imageUrl: post.imagePath
          ? this.dependencies.storageService.getPublicFileUrl(post.imagePath)
          : null,
      })),
      total: Number(total.count),
    };
  }
}
