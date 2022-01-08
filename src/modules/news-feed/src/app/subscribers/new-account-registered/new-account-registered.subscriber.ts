import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { NewAccountRegisteredEvent } from '@krater/integration-events';

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = NewAccountRegisteredEvent.name;

  public async handle(event: NewAccountRegisteredEvent, unitOfWork: UnitOfWork): Promise<void> {
    await unitOfWork
      .getCurrentTransaction()
      .insert({
        id: event.payload.accountId,
        nickname: event.payload.accountNickname,
      })
      .into(TableNames.PostAuthor);
  }
}
