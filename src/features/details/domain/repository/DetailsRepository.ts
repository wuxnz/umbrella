import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/model/item/DetailedItem';
import ExtractorAudio from '../../../plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../plugins/data/model/media/RawAudio';
import RawVideo from '../../../plugins/data/model/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

export interface DetailsRepository {
  fetchDetails: (id: string, plugin: Plugin) => Promise<Status<DetailedItem>>;
  getItemMedia: (
    id: string,
    plugin: Plugin,
  ) => Promise<(RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]>;
}
