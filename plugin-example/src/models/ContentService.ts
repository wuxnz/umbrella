import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import RawAudio from './media/RawAudio';
import RawVideo from './media/RawVideo';

abstract class ContentService {
  abstract search(query: string, page?: number): Promise<Category>;
  abstract getCategory(category: string, page?: number): Promise<Category>;
  abstract getHomeCategories(): Promise<Category[]>;
  abstract getItemDetails(id: string): Promise<DetailedItem>;
  abstract getItemMedia(id: string): Promise<(RawAudio | RawVideo)[]>;
}

export default ContentService;
