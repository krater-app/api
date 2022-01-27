import { TableNames } from '@infrastructure/table-names';
import { NotFoundError, QueryHandler } from '@krater/building-blocks';
import { QueryBuilder } from '@krater/database';
import { PostDetailsDTO } from '@root/dtos/post-details.dto';
import { GetPostDetailsQuery } from './get-post-details.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class GetPostDetailsQueryHandler
  implements QueryHandler<GetPostDetailsQuery, PostDetailsDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: GetPostDetailsQuery): Promise<PostDetailsDTO> {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select([
        'post.id',
        'feedItem.title',
        'feedItem.content',
        'feedItem.description',
        'feedItem.image_path AS imagePath',
        'feedItem.tags',
        'feedItem.created_at AS createdAt',
        'feedItem.type',
        'post.status',
      ])
      .where('post.id', query.payload.postId)
      .andWhere('post.author_id', query.payload.accountId)
      .join(
        {
          post: TableNames.Post,
        },
        'post.id',
        'feedItem.id',
      )
      .from({ feedItem: TableNames.FeedItem })
      .first();

    if (!result) {
      throw new NotFoundError("Post does not exist or you don't have access to it.");
    }

    return {
      ...result,
      link: null,
      isNsfw: false,
    };
  }
}
