export interface PostDetailsDTO {
  id: string;
  title: string | null;
  content: string | null;
  description: string | null;
  imageUrl: string | null;
  link: string | null;
  tags: string[];
  isNsfw: boolean;
  createdAt: Date;
  type: string;
  status: string;
}
