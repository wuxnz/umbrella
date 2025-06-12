// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/vidmoly.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';

class VidMoly implements Extractor {
  name = 'vidmoly';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const {data: responseData} = await axiosClient.get(data.url);

      const links = responseData.match(/file:\s*"([^"]+)"/);

      const m3u8Content = await axiosClient.get(links[1], {
        headers: {
          Referer: data.url,
        },
      });

      sources.push({
        url: links[1],
        isM3U8: links[1].includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      if (m3u8Content.data.includes('EXTM3U')) {
        const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
        for (const video of videoList ?? []) {
          if (!video.includes('m3u8')) continue;

          const url = video.split('\n')[1];
          const quality = video
            .split('RESOLUTION=')[1]
            .split(',')[0]
            .split('x')[1];

          sources.push({
            url: url,
            isM3U8: url.includes('.m3u8'),
            name: this.name,
            type: MediaType.RawVideo,
          });
        }
      }

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class VidMolyInfo implements ExtractorInfo {
  id: string = 'vidmoly';
  patterns: RegExp[] = [/vidmoly\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new VidMoly()];
}

export default VidMolyInfo;
