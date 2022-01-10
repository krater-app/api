import { LinkPost } from '@core/post-creation/link-post/link-post.aggregate-root';

export interface LinkPostDTO {
  id: string;
  title: string | null;
  description: string | null;
  link: string;
  authorId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  nsfw: boolean;
}

export const linkPostToLinkPostDTO = (linkPost: LinkPost): LinkPostDTO => ({
  id: linkPost.getId(),
  title: linkPost.getTitle(),
  description: linkPost.getDescription(),
  link: linkPost.getLink(),
  authorId: linkPost.getAuthorId(),
  status: linkPost.getStatus().getValue(),
  createdAt: linkPost.getCreatedAt().toISOString(),
  updatedAt: linkPost.getUpdatedAt().toISOString(),
  tags: linkPost.getTags() as string[],
  nsfw: linkPost.isNsfw(),
});
