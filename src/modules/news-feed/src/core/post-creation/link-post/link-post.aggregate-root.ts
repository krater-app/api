import { PostTag } from '@core/shared-kernel/post-tag/post-tag.value-object';
import { PostTitle } from '@core/post-creation/post-title/post-title.value-object';
import { PostCantContainMoreThanTenTagsRule } from '@core/post-creation/rules/post-cant-contain-more-than-ten-tags.rule';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { NewPostCreatedEvent } from '@krater/integration-events';
import { CreateNewLinkPostDTO } from '@root/dtos/create-new-link-post.dto';
import { LinkPostDescription } from './link-post-description/link-post-description.value-object';
import { Link } from './link/link.value-object';

interface LinkPostProps {
  title: PostTitle;
  link: Link;
  customImagePath: string | null;
  description: LinkPostDescription;
  authorId: UniqueEntityID;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: PostTag[];
  nsfw: boolean;
}

export interface PersistedLinkPost {
  id: string;
  title: string | null;
  link: string;
  customImagePath: string | null;
  description: string | null;
  authorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nsfw: boolean;
}

export class LinkPost extends AggregateRoot<LinkPostProps> {
  private constructor(props: LinkPostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({
    authorId,
    description,
    isNsfw,
    link,
    tags,
    title,
    customImagePath,
  }: CreateNewLinkPostDTO) {
    const uniqueTags = [...new Set(tags)];

    LinkPost.checkRule(new PostCantContainMoreThanTenTagsRule(uniqueTags));

    const date = new Date();

    const linkPost = new LinkPost({
      customImagePath,
      link: Link.createNew(link),
      authorId: new UniqueEntityID(authorId),
      createdAt: date,
      updatedAt: date,
      description: LinkPostDescription.createNew(description),
      nsfw: isNsfw,
      status: PostStatus.Draft,
      tags: uniqueTags.map(PostTag.createNew),
      title: PostTitle.createNew(title),
    });

    linkPost.addDomainEvent(
      new NewPostCreatedEvent({
        authorId,
        tags: uniqueTags,
        postId: linkPost.getId(),
      }),
    );

    return linkPost;
  }

  public static fromPersistence({
    id,
    status,
    createdAt,
    updatedAt,
    tags,
    description,
    title,
    authorId,
    link,
    ...props
  }: PersistedLinkPost) {
    return new LinkPost(
      {
        ...props,
        status: PostStatus.fromValue(status),
        description: LinkPostDescription.fromValue(description),
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        tags: tags.map(PostTag.fromValue),
        title: PostTitle.fromValue(title),
        authorId: new UniqueEntityID(authorId),
        link: Link.fromValue(link),
      },
      new UniqueEntityID(id),
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

  public getDescription() {
    return this.props.description.getValue();
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

  public getLink() {
    return this.props.link.getValue();
  }

  public isNsfw() {
    return this.props.nsfw;
  }
}
