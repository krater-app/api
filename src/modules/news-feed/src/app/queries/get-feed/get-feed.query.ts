import { PaginatedQuery, PaginationPayload } from '@krater/building-blocks';

export class GetFeedQuery implements PaginatedQuery {
  constructor(public readonly payload: PaginationPayload) {}
}
