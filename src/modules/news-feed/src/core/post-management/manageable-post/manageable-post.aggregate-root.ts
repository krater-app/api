import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { PostTag } from '@core/shared-kernel/post-tag/post-tag.value-object';
import { AggregateRoot, UnauthenticatedError, UniqueEntityID } from '@krater/building-blocks';
import { PostPublishedEvent } from '@krater/integration-events';
import { PostMustNotBeBannedRule } from './rules/post-must-not-be-banned.rule';
import { PostMustNotBePublishedAlreadyRule } from './rules/post-must-not-be-published-already.rule';
import { UserCantLikePostMoreThanOnceRule } from './rules/user-cant-like-post-more-than-once.rule';
import { UserMustBePostAuthorRule } from './rules/user-must-be-post-author.rule';

interface ManageablePostProps {
  postAuthorId: UniqueEntityID;
  status: PostStatus;
  tags: PostTag[];
  likedUserIDs: UniqueEntityID[];
  likedUserIDsToPersist: UniqueEntityID[];
}

export interface PersistedManageablePost {
  id: string;
  postAuthorId: string;
  status: string;
  tags: string[];
  likedUserIDs: string[];
}

export class ManageablePost extends AggregateRoot<ManageablePostProps> {
  private constructor(props: ManageablePostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({
    status,
    id,
    tags,
    postAuthorId,
    likedUserIDs,
  }: PersistedManageablePost) {
    return new ManageablePost(
      {
        status: PostStatus.fromValue(status),
        tags: tags.map(PostTag.fromValue),
        postAuthorId: new UniqueEntityID(postAuthorId),
        likedUserIDs: likedUserIDs.map((likeId) => new UniqueEntityID(likeId)),
        likedUserIDsToPersist: [],
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

  public like(userId: string) {
    ManageablePost.checkRule(new UserCantLikePostMoreThanOnceRule(userId, this.props.likedUserIDs));

    const uniqueUserId = new UniqueEntityID(userId);

    this.props.likedUserIDs.push(uniqueUserId);

    this.props.likedUserIDsToPersist.push(uniqueUserId);
  }

  public getStatus() {
    return this.props.status;
  }

  public getId() {
    return this.id.value;
  }

  public getLikedUserIDsToPersist() {
    return this.props.likedUserIDsToPersist.map((id) => id.value);
  }
}
