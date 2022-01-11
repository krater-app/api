import { TextPost } from '@core/post-creation/text-post/text-post.aggregate-root';

export interface TextPostDTO {
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

export const textPostToTextPostDTO = (textPost: TextPost): TextPostDTO => ({
  id: textPost.getId(),
  title: textPost.getTitle(),
  content: textPost.getContent(),
  authorId: textPost.getAuthorId(),
  status: textPost.getStatus().getValue(),
  createdAt: textPost.getCreatedAt().toISOString(),
  updatedAt: textPost.getUpdatedAt().toISOString(),
  tags: textPost.getTags() as string[],
  nsfw: textPost.isNsfw(),
});
