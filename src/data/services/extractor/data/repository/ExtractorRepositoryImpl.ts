import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import {ExtractorRepository} from '../../domain/repository/ExtractorRepository';
import {ExtractorService} from '../datasource/ExtractorService';

export class ExtractorRepositoryImpl implements ExtractorRepository {
  async extract(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawAudio[] | RawVideo[]> {
    return ExtractorService.extract(data);
  }
}
