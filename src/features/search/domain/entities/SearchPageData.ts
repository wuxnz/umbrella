import Category from '../../../plugins/data/models/item/Category';
import SourceType from '../../../plugins/data/models/source/SourceType';

export interface SearchPageData {
  query: string;
  pluginsSourceTypesToSearch: SourceType[];
  results: Category[];
}
