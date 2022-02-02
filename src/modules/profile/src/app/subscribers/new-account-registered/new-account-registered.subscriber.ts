import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccountEmailConfirmedEvent } from '@krater/integration-events';

export class NewAccountRegisteredSubscriber implements EventSubscriber<AccountEmailConfirmedEvent> {
  public readonly type = AccountEmailConfirmedEvent.name;

  public async handle(event: AccountEmailConfirmedEvent, unitOfWork: UnitOfWork): Promise<void> {
    await unitOfWork
      .getCurrentTransaction()
      .insert({
        id: event.payload.accountId,
        nickname: event.payload.accountNickname,
        joined_at: event.payload.registeredAt,
      })
      .into(TableNames.User);
  }
}
