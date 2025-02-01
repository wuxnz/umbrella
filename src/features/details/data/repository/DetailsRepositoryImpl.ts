import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../../domain/repository/DetailsRepository';
import {DetailsService} from '../datasource/DetailsService';

export class DetailsRepositoryImpl implements DetailsRepository {
  async fetchDetails(
    id: string,
    plugin: Plugin,
  ): Promise<Status<DetailedItem>> {
    return DetailsService.fetchDetails(id, plugin);
  }
}
