import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber, UniqueEntityID } from '@krater/building-blocks';
import { QueryBuilder, UnitOfWork } from '@krater/database';
import { NewPostCreatedEvent } from '@krater/integration-events';

export class NewTextPostCreatedSubscriber implements EventSubscriber<NewPostCreatedEvent> {
  public readonly type = NewPostCreatedEvent.name;

  public async handle(event: NewPostCreatedEvent, unitOfWork: UnitOfWork): Promise<void> {
    const tagIDs = await this.insertTagIfNotExist(
      unitOfWork.getCurrentTransaction(),
      event.payload.tags,
      event.payload.authorId,
    );

    if (!tagIDs.length) {
      return;
    }

    await this.insertTagPostRelationToDatabase(
      unitOfWork.getCurrentTransaction(),
      tagIDs,
      event.payload.postId,
    );
  }

  private async insertTagIfNotExist(
    queryBuilder: QueryBuilder,
    tagNames: string[],
    authorId: string,
  ) {
    let tagIDs: string[] = [];

    const result = await queryBuilder
      .select(['name', 'id'])
      .whereIn('name', tagNames)
      .from(TableNames.Tag);

    tagIDs = result.map(({ id }) => id);

    const createdAt = new Date().toISOString();

    const tagsToInsert = tagNames
      .filter((tagName) => !result.map(({ name }) => name).includes(tagName))
      .map((tagName) => ({
        id: new UniqueEntityID().value,
        name: tagName,
        created_at: createdAt,
        author_id: authorId,
      }));

    if (!tagsToInsert.length) {
      return tagIDs;
    }

    tagIDs = [...tagIDs, ...tagsToInsert.map(({ id }) => id)];

    await queryBuilder.insert(tagsToInsert).into(TableNames.Tag);

    return tagIDs;
  }

  private async insertTagPostRelationToDatabase(
    queryBuilder: QueryBuilder,
    tagIDs: string[],
    postId: string,
  ) {
    await queryBuilder
      .insert(
        tagIDs.map((tagId) => ({
          id: new UniqueEntityID().value,
          tag_id: tagId,
          post_id: postId,
        })),
      )
      .into(TableNames.PostTag);
  }
}
