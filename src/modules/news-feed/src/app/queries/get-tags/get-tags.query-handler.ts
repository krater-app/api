import { TableNames } from '@infrastructure/table-names';
import { QueryHandler } from '@krater/building-blocks';
import { paginationToKnex, QueryBuilder } from '@krater/database';
import { GetTagsDTO } from '@root/dtos/get-tags.dto';
import { GetTagsQuery } from './get-tags.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class GetTagsQueryHandler implements QueryHandler<GetTagsQuery, GetTagsDTO> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle({ payload }: GetTagsQuery): Promise<GetTagsDTO> {
    const { queryBuilder } = this.dependencies;

    const { start, limit } = paginationToKnex(payload.page, payload.limit);

    const total = await queryBuilder
      .count('id')
      .andWhereRaw(payload.searchString?.trim() ? `name LIKE '${payload.searchString}%'` : '')
      .from(TableNames.Tag)
      .first();

    const result = await queryBuilder
      .select(['name'])
      .pluck('name')
      .offset(start)
      .limit(limit)
      .andWhereRaw(payload.searchString?.trim() ? `name LIKE '${payload.searchString}%'` : '')
      .from(TableNames.Tag);

    return {
      tags: result,
      total: Number(total.count),
    };
  }
}
