import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {SearchRepositoryImpl} from '../../data/repository/SearchRepositoryImpl';
import {GetNextPageUsecase} from '../../domain/usecases/GetNextPageUsecase';
import {SearchUsecase} from '../../domain/usecases/SearchUsecase';

const search = new SearchUsecase(new SearchRepositoryImpl());
const getNextPage = new GetNextPageUsecase(new SearchRepositoryImpl());

export class SearchViewModel {
  search(): Promise<void> {
    return search.execute();
  }
  async getNextPage(page: number, plugin: Plugin): Promise<void> {
    return getNextPage.execute(page, plugin);
  }
}
