import Category from '../../../plugins/data/model/item/Category';
import SourceType from '../../../plugins/data/model/source/SourceType';

export interface SearchPageData {
  query: string;
  pluginsSourceTypesToSearch: SourceType[];
  results: Category[];
}
