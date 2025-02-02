import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import RawAudio from '../../../plugins/data/models/media/RawAudio';
import RawVideo from '../../../plugins/data/models/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

export interface DetailsRepository {
  fetchDetails: (id: string, plugin: Plugin) => Promise<Status<DetailedItem>>;
  getItemMedia: (
    id: string,
    plugin: Plugin,
  ) => Promise<(RawAudio | RawVideo)[]>;
}
