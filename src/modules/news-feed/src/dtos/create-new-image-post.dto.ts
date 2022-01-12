export interface CreateNewImagePostDTO {
  title: string | null;
  description: string | null;
  images: string[];
  tags: string[];
  isNsfw: boolean;
  authorId: string;
}
