import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';

export interface Extractor {
  name: string;
  execute: (
    data: ExtractorVideo | ExtractorAudio,
  ) => Promise<RawAudio[] | RawVideo[]>;
}
