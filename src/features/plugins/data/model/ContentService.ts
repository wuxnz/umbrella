import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import RawAudio from './media/RawAudio';
import RawVideo from './media/RawVideo';

// Content service
// This is the interface for the code
// that gets the data for the plugin
interface ContentService {
  search(query: string, page?: number): Promise<Category>;
  getCategory(category: string, page?: number): Promise<Category>;
  getHomeCategories(): Promise<Category[]>;
  getItemDetails(id: string): Promise<DetailedItem>;
  getItemMedia(id: string): Promise<(RawAudio | RawVideo)[]>;
}

export default ContentService;
