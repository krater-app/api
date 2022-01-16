export interface FeedPostItemDTO {
  id: string;
  title: string | null;
  content: string | null;
  description: string | null;
  imageUrl: string | null;
  likes: number;
  comments: number;
  type: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
}
