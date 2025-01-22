import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import Item from './item/Item';

abstract class ContentService {
  abstract search(query: string, page?: number): Promise<Category>;
  abstract getCategory(category: string, page?: number): Promise<Category>;
  abstract getHomeCategories(): Promise<Category[]>;
  abstract getItemDetails(id: string): Promise<DetailedItem>;
}

export default ContentService;
