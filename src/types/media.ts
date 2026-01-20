export type CategoryItem = {
  mediaId: number | string;
  type: string;
  sourcePath: string;
  thumbnail?: string;
  englishTitle: string;
  chineseTitle: string;
  date: string;
  introduce: string;
  location: string;
  tag: string;
  tags?: string[];
};
export type CategoryDetail = CategoryItem & {
  children: CategoryItem[];
  id?: string | number;
};
