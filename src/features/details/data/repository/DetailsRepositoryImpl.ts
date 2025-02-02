import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import RawAudio from '../../../plugins/data/models/media/RawAudio';
import RawVideo from '../../../plugins/data/models/media/RawVideo';
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

  async getItemMedia(
    id: string,
    plugin: Plugin,
  ): Promise<(RawAudio | RawVideo)[]> {
    return DetailsService.getItemMedia(id, plugin);
  }
}
