// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/vizcloud.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL} from '../../../../../../../core/utils/urlUtils';

class VizCloud implements Extractor {
  name = 'VizCloud';

  private readonly host = 'https://vidstream.pro';
  private keys: {
    cipher: string;
    encrypt: string;
    main: string;
    operations: Map<string, string>;
    post: string[];
    pre: string[];
  } = {
    cipher: '',
    encrypt: '',
    main: '',
    operations: new Map<string, string>(),
    pre: [],
    post: [],
  };

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    // Note: This extractor requires additional parameters (vizCloudHelper, apiKey) that are not available in the new interface
    // This is a simplified version that may not work without these parameters
    const vizID: Array<string> = videoUrl.href.split('/');
    if (!vizID.length) {
      throw new Error('Video not found');
    }

    // For now, we'll try to extract directly from the URL
    // This may need to be updated based on actual usage
    try {
      const response = await axiosClient.get(data.url);

      // Try to find direct video sources in the response
      const sourceMatches = response.data.match(/file:\s*"([^"]+)"/g);
      if (sourceMatches) {
        sourceMatches.forEach((match: string) => {
          const url = match.match(/file:\s*"([^"]+)"/)?.[1];
          if (url) {
            sources.push({
              url: url,
              isM3U8: url.includes('.m3u8'),
              name: this.name,
              type: MediaType.RawVideo,
            });
          }
        });
      }

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class VizCloudInfo implements ExtractorInfo {
  id: string = 'vizcloud';
  patterns: RegExp[] = [/vidstream\.pro/, /vizcloud\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new VizCloud()];
}

export default VizCloudInfo;
