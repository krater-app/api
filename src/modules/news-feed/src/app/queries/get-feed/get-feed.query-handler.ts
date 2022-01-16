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
      .count('id')
      .from(TableNames.FeedItem)
      .first();

    const result = await this.dependencies.queryBuilder
      .select([
        'id',
        'title',
        'content',
        'description',
        'image_path AS imagePath',
        'likes',
        'comments',
        'type',
        'created_by AS createdBy',
        'created_at AS createdAt',
        'tags',
      ])
      .offset(start)
      .limit(limit)
      .orderBy('created_at', 'desc')
      .from(TableNames.FeedItem);

    return {
      items: result.map((post) => ({
        ...post,
        imageUrl: post.imagePath
          ? this.dependencies.storageService.getPublicFileUrl(post.imagePath)
          : null,
      })),
      total: Number(total.count),
    };
  }
}
