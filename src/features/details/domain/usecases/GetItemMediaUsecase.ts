import RawAudio from '../../../plugins/data/models/media/RawAudio';
import RawVideo from '../../../plugins/data/models/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../repository/DetailsRepository';

export class GetItemMediaUsecase {
  constructor(private detailsRepository: DetailsRepository) {}

  async execute(id: string, plugin: Plugin): Promise<(RawAudio | RawVideo)[]> {
    return await this.detailsRepository.getItemMedia(id, plugin);
  }
}
