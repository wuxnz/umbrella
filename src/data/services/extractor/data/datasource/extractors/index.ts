import {ExtractorInfo} from '../../../domain/entities/ExtractorInfo';
import VidHideExtractorInfo from './video/VidHideExtractor';

const Extractors = {
  ExtractorVideo: [new VidHideExtractorInfo()] as ExtractorInfo[],
  Other: [],
};

export default Extractors;
