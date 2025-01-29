import SourceType from '../../../plugins/data/models/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {SearchRepository} from '../../domain/repository/SearchRepository';
import {SearchService} from '../datasource/SearchService';

export class SearchRepositoryImpl implements SearchRepository {
  async search(): Promise<void> {
    await SearchService.search();
  }

  async getNextPage(page: number, plugin: Plugin): Promise<void> {
    await SearchService.getNextPage(page, plugin);
  }
}
