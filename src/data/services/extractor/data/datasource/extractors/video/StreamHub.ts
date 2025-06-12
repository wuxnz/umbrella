// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/streamhub.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

class StreamHub implements Extractor {
  name = 'StreamHub';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const {data: responseData} = await axiosClient.get(data.url).catch(() => {
        throw new Error('Video not found');
      });

      // Extract packed JavaScript safely without eval()
      const evalMatch = /(eval)(\(f.*?)(\n<\/script>)/s.exec(responseData);
      if (!evalMatch || !evalMatch[2]) {
        throw new Error('Could not find packed JavaScript code');
      }

      const packedCode = evalMatch[2]
        .replace('eval', '')
        .replace(/^\(|\)$/g, '');
      const unpackedData = safeUnpack(packedCode);

      const links = unpackedData.match(/sources:\[\{src:"(.*?)"/);
      if (!links || !links[1]) {
        throw new Error('Could not extract video source from unpacked data');
      }

      const m3u8Content = await axiosClient.get(links[1], {
        headers: {
          Referer: links[1],
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

class StreamHubInfo implements ExtractorInfo {
  id: string = 'streamhub';
  patterns: RegExp[] = [/streamhub\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new StreamHub()];
}

export default StreamHubInfo;
