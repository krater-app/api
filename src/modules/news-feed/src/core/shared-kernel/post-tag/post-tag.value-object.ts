import { ValueObject } from '@krater/building-blocks';
import { TagNameMustBeValidRule } from './rules/tag-name-must-be-valid.rule';

interface PostTagProps {
  value: string;
}

export class PostTag extends ValueObject<PostTagProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static createNew(tagName: string) {
    PostTag.checkRule(new TagNameMustBeValidRule(tagName));

    return new PostTag(tagName);
  }

  public static fromValue(value: string) {
    return new PostTag(value);
  }

  public getValue() {
    return this.props.value;
  }
}
