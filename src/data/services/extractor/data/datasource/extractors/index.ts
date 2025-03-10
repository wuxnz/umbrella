import {ExtractorInfo} from '../../../domain/entities/ExtractorInfo';
import JWPlayerInfo from './video/JWPlayerExtractor';
import VidHideExtractorInfo from './video/VidHideExtractor';

const Extractors = {
  ExtractorVideo: [
    new VidHideExtractorInfo(),
    new JWPlayerInfo(),
  ] as ExtractorInfo[],
  Other: [],
};

export default Extractors;
