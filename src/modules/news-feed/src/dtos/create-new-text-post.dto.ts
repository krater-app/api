export interface CreateNewTextPostDTO {
  title: string | null;
  content: string;
  tags: string[];
  isNsfw: boolean;
  authorId: string;
}
