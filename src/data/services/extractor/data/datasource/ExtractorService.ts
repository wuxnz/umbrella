import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../domain/entities/Extractor';
import {ExtractorInfo} from '../../domain/entities/ExtractorInfo';

import Extractors from './extractors/index';

export const ExtractorService = {
  getExtractorsByType(type: MediaType): ExtractorInfo[] {
    switch (type) {
      case MediaType.ExtractorVideo:
        return Extractors.ExtractorVideo;
      default:
        return Extractors.Other;
    }
  },

  async extract(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawAudio[] | RawVideo[]> {
    const extractors = this.getExtractorsByType(data.type);
    const matchedExtractors = extractors.filter(
      (e: ExtractorInfo) =>
        e.patterns.some(p => data.url.match(p)) &&
        e.extractorMediaType === data.type,
    );
    if (!matchedExtractors.length) {
      throw new Error('Extractor not found');
    }
    var sources: any[] = [];
    var index = 0;
    for (var e in matchedExtractors) {
      sources = [
        ...sources,
        ...(await matchedExtractors[index].extractors.map(e =>
          e.execute(data),
        )),
      ];
    }
    if (data.type === MediaType.ExtractorAudio) {
      return sources as RawAudio[];
    }
    return sources as RawVideo[];
  },
};
