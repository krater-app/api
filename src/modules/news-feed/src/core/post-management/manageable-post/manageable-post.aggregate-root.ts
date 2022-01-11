import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { PostTag } from '@core/shared-kernel/post-tag/post-tag.value-object';
import { AggregateRoot, UnauthenticatedError, UniqueEntityID } from '@krater/building-blocks';
import { PostPublishedEvent } from '@krater/integration-events';
import { PostMustNotBeBannedRule } from './rules/post-must-not-be-banned.rule';
import { PostMustNotBePublishedAlreadyRule } from './rules/post-must-not-be-published-already.rule';
import { UserMustBePostAuthorRule } from './rules/user-must-be-post-author.rule';

interface ManageablePostProps {
  postAuthorId: UniqueEntityID;
  status: PostStatus;
  tags: PostTag[];
}

export interface PersistedManageablePost {
  id: string;
  postAuthorId: string;
  status: string;
  tags: string[];
}

export class ManageablePost extends AggregateRoot<ManageablePostProps> {
  private constructor(props: ManageablePostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ status, id, tags, postAuthorId }: PersistedManageablePost) {
    return new ManageablePost(
      {
        status: PostStatus.fromValue(status),
        tags: tags.map(PostTag.fromValue),
        postAuthorId: new UniqueEntityID(postAuthorId),
      },
      new UniqueEntityID(id),
    );
  }

  public publish(userId: string) {
    ManageablePost.checkRule(
      new UserMustBePostAuthorRule(this.props.postAuthorId, userId),
      UnauthenticatedError,
    );
    ManageablePost.checkRule(new PostMustNotBeBannedRule(this.props.status));
    ManageablePost.checkRule(new PostMustNotBePublishedAlreadyRule(this.props.status));

    this.props.status = PostStatus.Active;

    this.addDomainEvent(
      new PostPublishedEvent({
        postId: this.id.value,
        tags: this.props.tags.map((tag) => tag.getValue()),
      }),
    );
  }

  public getStatus() {
    return this.props.status;
  }

  public getId() {
    return this.id.value;
  }
}
