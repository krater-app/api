import { Avatar } from '@core/avatar/avatar.value-object';
import { ProfileSettings } from '@core/profile-settings/profile-settings.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';

interface ProfileManagementProps {
  avatar: Avatar;
  description: string | null;
  settings: ProfileSettings;
}

interface CreateNewProfileManagement {
  accountId: string;
}

export class ProfileManagement extends AggregateRoot<ProfileManagementProps> {
  private constructor(props: ProfileManagementProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ accountId }: CreateNewProfileManagement) {
    return new ProfileManagement(
      {
        avatar: Avatar.createNew(),
        description: null,
        settings: ProfileSettings.createNew(),
      },
      new UniqueEntityID(accountId),
    );
  }

  public toJSON() {
    return {
      id: this.id.value,
      avatar: {
        url: this.props.avatar.getUrl(),
      },
      description: this.props.description,
      settings: {
        newMessagesSubscription: this.props.settings.isNewMessagesSubscriptionActive(),
        newNotificationsSubscription: this.props.settings.isNewNotificationsSubscriptionActive(),
        newsletterSubscription: this.props.settings.isNewsletterSubscriptionActive(),
      },
    };
  }
}
