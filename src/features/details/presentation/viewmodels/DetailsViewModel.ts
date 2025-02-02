import Status from '../../../../core/shared/types/Status';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import RawAudio from '../../../plugins/data/models/media/RawAudio';
import RawVideo from '../../../plugins/data/models/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepositoryImpl} from '../../data/repository/DetailsRepositoryImpl';
import {FetchDetailsUsecase} from '../../domain/usecases/FetchDetailsUsecase';
import {GetItemMediaUsecase} from '../../domain/usecases/GetItemMediaUsecase';

const fetchDetails = new FetchDetailsUsecase(new DetailsRepositoryImpl());
const getItemMedia = new GetItemMediaUsecase(new DetailsRepositoryImpl());

export class DetailsViewModel {
  async fetchDetails(
    id: string,
    plugin: Plugin,
  ): Promise<Status<DetailedItem>> {
    return await fetchDetails.execute(id, plugin);
  }

  async getItemMedia(
    id: string,
    plugin: Plugin,
  ): Promise<(RawAudio | RawVideo)[]> {
    return await getItemMedia.execute(id, plugin);
  }
}
