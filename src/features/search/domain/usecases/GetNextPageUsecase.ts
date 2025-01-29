import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {SearchRepository} from '../repository/SearchRepository';

export class GetNextPageUsecase {
  constructor(private searchRepository: SearchRepository) {}
  execute(page: number, plugin: Plugin): Promise<void> {
    return this.searchRepository.getNextPage(page, plugin);
  }
}
