import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import Item from './item/Item';

export interface ContentService {
  search(query: string, page?: number): Promise<Category>;
  getCategory(category: string, page?: number): Promise<Category>;
  getHomeCategories(): Promise<Category[]>;
  getItemDetails(id: string): Promise<DetailedItem>;
}
