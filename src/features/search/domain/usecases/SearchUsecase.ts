import Category from '../../../plugins/data/models/item/Category';
import SourceType from '../../../plugins/data/models/source/SourceType';
import {SearchRepository} from '../repository/SearchRepository';

export class SearchUsecase {
  constructor(private searchRepository: SearchRepository) {}

  execute(): Promise<void> {
    return this.searchRepository.search();
  }
}
