import { ValueObject } from '@krater/building-blocks';

interface ProfileSettingsProps {
  newsletterSubscription: boolean;
  newMessagesSubscription: boolean;
  newNotificationsSubscription: boolean;
}

export class ProfileSettings extends ValueObject<ProfileSettingsProps> {
  private constructor(props: ProfileSettingsProps) {
    super(props);
  }

  public static createNew() {
    return new ProfileSettings({
      newMessagesSubscription: true,
      newNotificationsSubscription: true,
      newsletterSubscription: true,
    });
  }

  public static fromValue(props: ProfileSettingsProps) {
    return new ProfileSettings(props);
  }

  public isNewMessagesSubscriptionActive() {
    return this.props.newMessagesSubscription;
  }

  public isNewsletterSubscriptionActive() {
    return this.props.newsletterSubscription;
  }

  public isNewNotificationsSubscriptionActive() {
    return this.props.newNotificationsSubscription;
  }
}
