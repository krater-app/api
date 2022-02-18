import { ProfileManagement } from '@core/profile-management/profile-management.aggregate-root';
import { TableNames } from '@infrastructure/table-names';
import { EventSubscriber } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccountEmailConfirmedEvent } from '@krater/integration-events';

export class NewAccountRegisteredSubscriber implements EventSubscriber<AccountEmailConfirmedEvent> {
  public readonly type = AccountEmailConfirmedEvent.name;

  public async handle(event: AccountEmailConfirmedEvent, unitOfWork: UnitOfWork): Promise<void> {
    await Promise.all([
      this.saveCurrentUser(event, unitOfWork),
      this.createUserProfile(event, unitOfWork),
    ]);
  }

  private async saveCurrentUser(event: AccountEmailConfirmedEvent, unitOfWork: UnitOfWork) {
    await unitOfWork
      .getCurrentTransaction()
      .insert({
        id: event.payload.accountId,
        nickname: event.payload.accountNickname,
        joined_at: event.payload.registeredAt,
      })
      .into(TableNames.User);
  }

  private async createUserProfile(event: AccountEmailConfirmedEvent, unitOfWork: UnitOfWork) {
    const profile = ProfileManagement.createNew({
      accountId: event.payload.accountId,
    });

    const { avatar, id, settings, description } = profile.toJSON();

    await unitOfWork
      .getCurrentTransaction()
      .insert({
        id,
        description,
        newsletter_subscription: settings.newsletterSubscription,
        new_messages_subscription: settings.newMessagesSubscription,
        new_notifications_subscription: settings.newNotificationsSubscription,
        avatar_path: avatar.url,
      })
      .into(TableNames.ProfileSettings);
  }
}
