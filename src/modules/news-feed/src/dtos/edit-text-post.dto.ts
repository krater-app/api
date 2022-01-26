export interface EditTextPostDTO {
  accountId: string;
  title?: string | null;
  content?: string;
  tags?: string[];
  isNsfw?: boolean;
}
