import { ValueObject } from '@krater/building-blocks';
import { PostTitleMustBeValid } from './rules/post-title-must-be-valid.rule';

interface PostTitleProps {
  value: string | null;
}

export class PostTitle extends ValueObject<PostTitleProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static createNew(title: string | null) {
    PostTitle.checkRule(new PostTitleMustBeValid(title));

    return new PostTitle(title);
  }

  public update(newTitle: string | null) {
    PostTitle.checkRule(new PostTitleMustBeValid(newTitle));

    return new PostTitle(newTitle);
  }

  public static fromValue(value: string | null) {
    return new PostTitle(value);
  }

  public getValue() {
    return this.props.value;
  }
}
