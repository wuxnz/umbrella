// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/mp4upload.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';

class Mp4Upload implements Extractor {
  name = 'mp4upload';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const {data: responseData} = await axiosClient.get(data.url);

      const playerSrc = responseData.match(
        /(?<=player\.src\()\s*{\s*type:\s*"[^"]+",\s*src:\s*"([^"]+)"\s*}\s*(?=\);)/s,
      );
      const streamUrl = playerSrc[1];

      if (!streamUrl) throw new Error('Stream url not found');

      sources.push({
        url: streamUrl,
        isM3U8: streamUrl.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class Mp4UploadInfo implements ExtractorInfo {
  id: string = 'mp4upload';
  patterns: RegExp[] = [/mp4upload\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new Mp4Upload()];
}

export default Mp4UploadInfo;
