import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/model/item/DetailedItem';
import ExtractorAudio from '../../../plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../plugins/data/model/media/RawAudio';
import RawVideo from '../../../plugins/data/model/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepositoryImpl} from '../../data/repository/DetailsRepositoryImpl';
import {DetailsRepository} from '../../domain/repository/DetailsRepository';
import {FetchDetailsUsecase} from '../../domain/usecases/FetchDetailsUsecase';
import {GetItemMediaUsecase} from '../../domain/usecases/GetItemMediaUsecase';

const fetchDetails = new FetchDetailsUsecase(new DetailsRepositoryImpl());
const getItemMedia = new GetItemMediaUsecase(new DetailsRepositoryImpl());

export class DetailsViewModel implements DetailsRepository {
  async fetchDetails(
    id: string,
    plugin: Plugin,
  ): Promise<Status<DetailedItem>> {
    return await fetchDetails.execute(id, plugin);
  }

  async getItemMedia(
    id: string,
    plugin: Plugin,
  ): Promise<(RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]> {
    return await getItemMedia.execute(id, plugin);
  }
}
