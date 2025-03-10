import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import {ExtractorRepositoryImpl} from '../../data/repository/ExtractorRepositoryImpl';
import {ExtractorRepository} from '../../domain/repository/ExtractorRepository';
import {ExtractUsecase} from '../../domain/usecases/ExtractUsecase';

const extract = new ExtractUsecase(new ExtractorRepositoryImpl());

export class ExtractorViewModel implements ExtractorRepository {
  extract(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawAudio[] | RawVideo[]> {
    return extract.execute(data);
  }
}
