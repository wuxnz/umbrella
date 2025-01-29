import SourceType from '../../../plugins/data/models/source/SourceType';
import {SearchRepository} from '../../domain/repository/SearchRepository';
import {SearchService} from '../datasource/SearchService';

export class SearchRepositoryImpl implements SearchRepository {
  async search(): Promise<void> {
    await SearchService.search();
  }
}
