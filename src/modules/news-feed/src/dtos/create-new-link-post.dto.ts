export interface CreateNewLinkPostDTO {
  title: string | null;
  description: string | null;
  customImagePath: string | null;
  link: string;
  tags: string[];
  isNsfw: boolean;
  authorId: string;
}
