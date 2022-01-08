import { PostStatus } from '@core/post-status/post-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { CreateNewTextPostDTO } from '@root/dtos/create-new-text-post.dto';
import { NewTextPostCreatedEvent, TextPostPublishedEvent } from '@krater/integration-events';
import { PostTitle } from '@core/post-title/post-title.value-object';
import { PostTag } from '@core/post-tag/post-tag.value-object';
import { TextPostContent } from '@core/text-post-content/text-post-content.value-object';
import { TextPostMustNotBeBannedRule } from './rules/text-post-must-not-be-banned.rule';
import { TextPostMustNotBePublishedAlreadyRule } from './rules/text-post-must-not-be-published-already.rule';
import { TextPostCantContainMoreThanTenTagsRule } from './rules/text-post-cant-contain-more-than-ten-tags.rule';

interface TextPostProps {
  title: PostTitle;
  content: TextPostContent;
  authorId: UniqueEntityID;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: PostTag[];
  nsfw: boolean;
}

interface PersistedTextPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nsfw: boolean;
}

export class TextPost extends AggregateRoot<TextPostProps> {
  private constructor(props: TextPostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ authorId, content, isNsfw, tags, title }: CreateNewTextPostDTO) {
    const uniqueTags = [...new Set(tags)];

    TextPost.checkRule(new TextPostCantContainMoreThanTenTagsRule(uniqueTags));

    const textPost = new TextPost({
      content: TextPostContent.createNew(content),
      title: PostTitle.createNew(title),
      tags: uniqueTags.map(PostTag.createNew),
      authorId: new UniqueEntityID(authorId),
      status: PostStatus.Draft,
      createdAt: new Date(),
      updatedAt: new Date(),
      nsfw: isNsfw,
    });

    textPost.addDomainEvent(
      new NewTextPostCreatedEvent({
        textPostId: textPost.getId(),
        tags: textPost.getTags() as string[],
      }),
    );

    return textPost;
  }

  public static fromPersistence({
    id,
    authorId,
    content,
    createdAt,
    nsfw,
    status,
    tags,
    title,
    updatedAt,
  }: PersistedTextPost) {
    return new TextPost(
      {
        nsfw,
        authorId: new UniqueEntityID(authorId),
        content: TextPostContent.fromValue(content),
        title: PostTitle.fromValue(title),
        createdAt: new Date(createdAt),
        status: PostStatus.fromValue(status),
        tags: tags.map(PostTag.fromValue),
        updatedAt: new Date(updatedAt),
      },
      new UniqueEntityID(id),
    );
  }

  public publish() {
    TextPost.checkRule(new TextPostMustNotBeBannedRule(this.props.status));

    TextPost.checkRule(new TextPostMustNotBePublishedAlreadyRule(this.props.status));

    this.props.status = PostStatus.Active;

    this.addDomainEvent(
      new TextPostPublishedEvent({
        textPostId: this.getId(),
        tags: this.getTags() as string[],
      }),
    );
  }

  public getId() {
    return this.id.value;
  }

  public getTags(): ReadonlyArray<string> {
    return this.props.tags.map((tag) => tag.getValue());
  }

  public getStatus() {
    return this.props.status;
  }

  public getTitle() {
    return this.props.title.getValue();
  }

  public getContent() {
    return this.props.content.getValue();
  }

  public getAuthorId() {
    return this.props.authorId.value;
  }

  public getCreatedAt() {
    return this.props.createdAt;
  }

  public getUpdatedAt() {
    return this.props.updatedAt;
  }

  public isNsfw() {
    return this.props.nsfw;
  }
}
