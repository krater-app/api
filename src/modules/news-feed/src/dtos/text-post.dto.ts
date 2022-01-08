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
