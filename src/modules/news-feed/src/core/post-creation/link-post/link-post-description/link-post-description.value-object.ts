import { ValueObject } from '@krater/building-blocks';
import { LinkPostDescriptionMustBeValidRule } from './rules/link-post-description-must-be-valid.rule';

interface LinkPostDescriptionProps {
  value: string | null;
}

export class LinkPostDescription extends ValueObject<LinkPostDescriptionProps> {
  private constructor(value: string | null) {
    super({
      value,
    });
  }

  public static createNew(value: string | null) {
    LinkPostDescription.checkRule(new LinkPostDescriptionMustBeValidRule(value));

    return new LinkPostDescription(value);
  }

  public static fromValue(value: string | null) {
    return new LinkPostDescription(value);
  }

  public getValue() {
    return this.props.value;
  }
}
