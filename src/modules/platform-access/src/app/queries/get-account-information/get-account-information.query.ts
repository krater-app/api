import { Query } from '@krater/building-blocks';

interface Payload {
  accountId: string;
}

export class GetAccountInformationQuery implements Query<Payload> {
  constructor(public readonly payload: Payload) {}
}
