import { TableNames } from '@infrastructure/table-names';
import { NotFoundError, QueryHandler } from '@krater/building-blocks';
import { QueryBuilder } from '@krater/database';
import { UserPublicProfileDTO } from '@root/dtos/user-public-profile.dto';
import { GetUserPublicProfileQuery } from './get-user-public-profile.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class GetUserPublicProfileQueryHandler
  implements QueryHandler<GetUserPublicProfileQuery, UserPublicProfileDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: GetUserPublicProfileQuery): Promise<UserPublicProfileDTO> {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'nickname', 'joined_at AS joinedAt'])
      .where('id', query.payload.profileId)
      .from(TableNames.User)
      .first();

    if (!result) {
      throw new NotFoundError('Profile with provided id does not exist.');
    }

    // TODO: Implement when data will be available
    return {
      ...result,
      commentsCount: 0,
      postsCount: 0,
    };
  }
}
