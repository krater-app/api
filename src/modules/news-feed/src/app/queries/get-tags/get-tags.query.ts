import { PaginationPayload, Query } from '@krater/building-blocks';

interface Payload extends PaginationPayload {
  searchString?: string;
}

export class GetTagsQuery implements Query<Payload> {
  constructor(public readonly payload: Payload) {}
}
