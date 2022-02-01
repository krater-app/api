import { Query } from '@krater/building-blocks';

interface Payload {
  profileId: string;
}

export class GetUserPublicProfileQuery implements Query<Payload> {
  constructor(public readonly payload: Payload) {}
}
