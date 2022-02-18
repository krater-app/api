import { ValueObject } from '@krater/building-blocks';

interface AvatarProps {
  url: string | null;
}

export class Avatar extends ValueObject<AvatarProps> {
  private constructor(props: AvatarProps) {
    super(props);
  }

  public static createNew() {
    return new Avatar({
      url: null,
    });
  }

  public static fromValue(props: AvatarProps) {
    return new Avatar(props);
  }

  public getUrl() {
    return this.props.url;
  }
}
