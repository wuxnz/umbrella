import SourceType from '../../../plugins/data/models/source/SourceType';
import {SearchRepositoryImpl} from '../../data/repository/SearchRepositoryImpl';
import {SearchUsecase} from '../../domain/usecases/SearchUsecase';

const search = new SearchUsecase(new SearchRepositoryImpl());

export class SearchViewModel {
  search(): Promise<void> {
    return search.execute();
  }
}
