import { QueryHandler } from '@krater/building-blocks';
import { UserPublicProfileDTO } from '@root/dtos/user-public-profile.dto';
import { GetUserPublicProfileQuery } from './get-user-public-profile.query';

export class GetUserPublicProfileQueryHandler
  implements QueryHandler<GetUserPublicProfileQuery, UserPublicProfileDTO>
{
  public async handle(): Promise<UserPublicProfileDTO> {
    // TODO: Implement when data will be available
    return {
      id: '#id',
      nickname: 'Johnny',
      joinedAt: new Date().toISOString(),
      commentsCount: 0,
      postsCount: 0,
    };
  }
}
