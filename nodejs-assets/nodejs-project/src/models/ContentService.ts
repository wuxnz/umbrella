import Category from './item/Category';
import DetailedItem from './item/DetailedItem';
import Item from './item/Item';
import ExtractorAudio from './media/ExtractorAudio';
import ExtractorVideo from './media/ExtractorVideo';
import RawAudio from './media/RawAudio';
import RawVideo from './media/RawVideo';

interface ContentService {
  search(query: string, page?: number): Promise<Category>;
  getCategory(category: string, page?: number): Promise<Category>;
  getHomeCategories(): Promise<Category[]>;
  getItemDetails(id: string): Promise<DetailedItem>;
  getItemMedia(
    id: string,
  ): Promise<(RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]>;
}

export default ContentService;
