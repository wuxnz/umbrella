import Category from '../../../plugins/data/models/item/Category';
import SourceType from '../../../plugins/data/models/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

// Search repository
// This is the interface for the search repository
// Describes the methods that the search repository must implement

export interface SearchRepository {
  search(): Promise<void>;
  getNextPage(page: number, plugin: Plugin): Promise<void>;
}
