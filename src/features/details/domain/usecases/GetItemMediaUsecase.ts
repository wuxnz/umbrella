import ExtractorAudio from '../../../plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../plugins/data/model/media/RawAudio';
import RawVideo from '../../../plugins/data/model/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {DetailsRepository} from '../repository/DetailsRepository';

export class GetItemMediaUsecase {
  constructor(private detailsRepository: DetailsRepository) {}

  async execute(
    id: string,
    plugin: Plugin,
  ): Promise<(RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]> {
    return await this.detailsRepository.getItemMedia(id, plugin);
  }
}
