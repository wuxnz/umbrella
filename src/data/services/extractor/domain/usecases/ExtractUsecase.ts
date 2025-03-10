import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import {ExtractorRepository} from '../repository/ExtractorRepository';

export class ExtractUsecase {
  constructor(private extractorRepository: ExtractorRepository) {}

  async execute(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawAudio[] | RawVideo[]> {
    return this.extractorRepository.extract(data);
  }
}
