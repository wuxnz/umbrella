import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {SearchRepositoryImpl} from '../../data/repository/SearchRepositoryImpl';
import {SearchRepository} from '../../domain/repository/SearchRepository';
import {GetNextPageUsecase} from '../../domain/usecases/GetNextPageUsecase';
import {SearchUsecase} from '../../domain/usecases/SearchUsecase';

const search = new SearchUsecase(new SearchRepositoryImpl());
const getNextPage = new GetNextPageUsecase(new SearchRepositoryImpl());

export class SearchViewModel implements SearchRepository {
  search(): Promise<void> {
    return search.execute();
  }
  async getNextPage(page: number, plugin: Plugin): Promise<void> {
    return getNextPage.execute(page, plugin);
  }
}
