import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { PostTag } from '@core/shared-kernel/post-tag/post-tag.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { StorageService } from '@krater/storage';
import { CreateNewImagePostDTO } from '@root/dtos/create-new-image-post.dto';
import { PostDescription } from '../post-description/post-description.value-object';
import { PostTitle } from '../post-title/post-title.value-object';
import { Image, PersistedImage } from './image/image.entity';

interface ImagePostProps {
  title: PostTitle;
  description: PostDescription;
  images: Image[];
  authorId: UniqueEntityID;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  tags: PostTag[];
  nsfw: boolean;
}

interface PersistedImagePost {
  id: string;
  title: string | null;
  description: string | null;
  images: PersistedImage[];
  authorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nsfw: boolean;
}

export class ImagePost extends AggregateRoot<ImagePostProps> {
  private constructor(props: ImagePostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async createNew(
    { authorId, description, isNsfw, title, images, tags }: CreateNewImagePostDTO,
    storageService: StorageService,
  ) {
    const now = new Date();

    return new ImagePost({
      title: PostTitle.createNew(title),
      description: PostDescription.createNew(description),
      images: await Promise.all(
        images.map((image) => Image.fromTemporaryBucket(image, storageService)),
      ),
      authorId: new UniqueEntityID(authorId),
      status: PostStatus.Draft,
      createdAt: now,
      updatedAt: now,
      tags: tags.map(PostTag.createNew),
      nsfw: isNsfw,
    });
  }

  public static fromPersistence({
    id,
    authorId,
    createdAt,
    updatedAt,
    description,
    images,
    nsfw,
    tags,
    status,
    title,
  }: PersistedImagePost) {
    return new ImagePost(
      {
        nsfw,
        title: PostTitle.fromValue(title),
        description: PostDescription.fromValue(description),
        status: PostStatus.fromValue(status),
        authorId: new UniqueEntityID(authorId),
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        images: images.map(Image.fromPersistence),
        tags: tags.map(PostTag.fromValue),
      },
      new UniqueEntityID(id),
    );
  }

  public getId() {
    return this.id.value;
  }

  public getTitle() {
    return this.props.title.getValue();
  }

  public getDescription() {
    return this.props.description.getValue();
  }

  public getStatus() {
    return this.props.status.getValue();
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

  public getImages() {
    return this.props.images;
  }

  public getTags() {
    return this.props.tags.map((tag) => tag.getValue());
  }

  public isNsfw() {
    return this.props.nsfw;
  }
}
