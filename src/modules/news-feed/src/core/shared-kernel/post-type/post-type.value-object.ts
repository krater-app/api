import { PostTypeNotSupportedError } from '@errors/post-type-not-supported.error';
import { ValueObject } from '@krater/building-blocks';

export enum PostTypeValue {
  Image = 'Image',
  Text = 'Text',
  Link = 'Link',
}

interface PostTypeProps {
  value: string;
}

export class PostType extends ValueObject<PostTypeProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static Image = new PostType(PostTypeValue.Image);

  public static Text = new PostType(PostTypeValue.Text);

  public static Link = new PostType(PostTypeValue.Link);

  public static fromValue(value: string) {
    switch (value) {
      case PostTypeValue.Image:
        return this.Image;

      case PostTypeValue.Text:
        return this.Text;

      case PostTypeValue.Link:
        return this.Link;

      default:
        throw new PostTypeNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
