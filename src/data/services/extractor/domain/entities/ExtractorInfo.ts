import MediaType from '../../../../../features/plugins/data/model/media/MediaType';
import {Extractor} from './Extractor';

export interface ExtractorInfo {
  id: string;
  patterns: RegExp[];
  extractorMediaType: MediaType;
  extractors: Extractor[];
}
