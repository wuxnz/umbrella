import Category from '../../../plugins/data/model/item/Category';
import SourceType from '../../../plugins/data/model/source/SourceType';
import {SearchRepository} from '../repository/SearchRepository';

export class SearchUsecase {
  constructor(private searchRepository: SearchRepository) {}

  execute(): Promise<void> {
    return this.searchRepository.search();
  }
}
