import { PostRatingTypeNotSupportedError } from '@errors/post-rating-type-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum PostRatingTypeValue {
  Neutral = 'Neutral',
  Like = 'Like',
  Disslike = 'Disslike',
}

interface PostRatingTypeProps {
  value: string;
}

export class PostRatingType extends ValueObject<PostRatingTypeProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Neutral = new PostRatingType(PostRatingTypeValue.Neutral);

  public static Like = new PostRatingType(PostRatingTypeValue.Like);

  public static Disslike = new PostRatingType(PostRatingTypeValue.Disslike);

  public static fromValue(value: string) {
    switch (value) {
      case PostRatingTypeValue.Neutral:
        return this.Neutral;

      case PostRatingTypeValue.Like:
        return this.Like;

      case PostRatingTypeValue.Disslike:
        return this.Disslike;

      default:
        throw new PostRatingTypeNotSupportedError();
    }
  }
}
