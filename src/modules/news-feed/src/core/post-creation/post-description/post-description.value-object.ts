import { ValueObject } from '@krater/building-blocks';
import { LinkPostDescriptionMustBeValidRule } from './rules/post-description-must-be-valid.rule';

interface PostDescriptionProps {
  value: string | null;
}

export class PostDescription extends ValueObject<PostDescriptionProps> {
  private constructor(value: string | null) {
    super({
      value,
    });
  }

  public static createNew(value: string | null) {
    PostDescription.checkRule(new LinkPostDescriptionMustBeValidRule(value));

    return new PostDescription(value);
  }

  public static fromValue(value: string | null) {
    return new PostDescription(value);
  }

  public getValue() {
    return this.props.value;
  }
}
