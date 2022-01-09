import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber, UniqueEntityID } from '@krater/building-blocks';
import { QueryBuilder, UnitOfWork } from '@krater/database';
import { NewTextPostCreatedEvent } from '@krater/integration-events';

export class NewTextPostCreatedSubscriber implements EventSubscriber<NewTextPostCreatedEvent> {
  public readonly type = NewTextPostCreatedEvent.name;

  public async handle(event: NewTextPostCreatedEvent, unitOfWork: UnitOfWork): Promise<void> {
    await this.insertTagIfNotExist(
      unitOfWork.getCurrentTransaction(),
      event.payload.tags,
      event.payload.authorId,
    );
  }

  private async insertTagIfNotExist(
    queryBuilder: QueryBuilder,
    tagNames: string[],
    authorId: string,
  ) {
    const result = await queryBuilder
      .select('name')
      .pluck('name')
      .whereIn('name', tagNames)
      .from(TableNames.Tag);

    const createdAt = new Date().toISOString();

    const tagsToInsert = tagNames
      .filter((tagName) => !result.includes(tagName))
      .map((tagName) => ({
        id: new UniqueEntityID().value,
        name: tagName,
        created_at: createdAt,
        author_id: authorId,
      }));

    if (!tagsToInsert.length) {
      return;
    }

    await queryBuilder.insert(tagsToInsert).into(TableNames.Tag);
  }
}
