import { PostStatusNotSupportedError } from '@errors/post-status-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum PostStatusValue {
  Draft = 'Draft',
  Active = 'Active',
  Banned = 'Banned',
}

interface PostStatusProps {
  value: string;
}

export class PostStatus extends ValueObject<PostStatusProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Draft = new PostStatus(PostStatusValue.Draft);

  public static Active = new PostStatus(PostStatusValue.Active);

  public static Banned = new PostStatus(PostStatusValue.Banned);

  public static fromValue(value: string) {
    switch (value) {
      case PostStatusValue.Draft:
        return this.Draft;

      case PostStatusValue.Active:
        return this.Active;

      case PostStatusValue.Banned:
        return this.Banned;

      default:
        throw new PostStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
