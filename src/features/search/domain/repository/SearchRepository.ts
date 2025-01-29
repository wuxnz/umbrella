import Category from '../../../plugins/data/models/item/Category';
import SourceType from '../../../plugins/data/models/source/SourceType';

// Search repository
// This is the interface for the search repository
// Describes the methods that the search repository must implement

export interface SearchRepository {
  search(): Promise<void>;
}
