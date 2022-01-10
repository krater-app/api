import { ValueObject } from '@krater/building-blocks';
import { LinkMustBeInValidFormatRule } from './rules/link-must-be-in-valid-format.rule';

interface LinkProps {
  value: string;
}

export class Link extends ValueObject<LinkProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static createNew(link: string) {
    Link.checkRule(new LinkMustBeInValidFormatRule(link));

    return new Link(link);
  }

  public static fromValue(value: string) {
    return new Link(value);
  }

  public getValue() {
    return this.props.value;
  }
}
