import { ValueObject } from '@krater/building-blocks';
import { TextPostContentMustBeValidRule } from './rules/text-post-content-must-be-valid.rule';

interface TextPostContentProps {
  content: string;
}

export class TextPostContent extends ValueObject<TextPostContentProps> {
  private constructor(value: string) {
    super({
      content: value,
    });
  }

  public static createNew(content: string) {
    TextPostContent.checkRule(new TextPostContentMustBeValidRule(content));

    return new TextPostContent(content);
  }

  public static fromValue(content: string) {
    return new TextPostContent(content);
  }

  public getValue() {
    return this.props.content;
  }
}
