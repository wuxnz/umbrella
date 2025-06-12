// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/vidhide.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

class VidHide implements Extractor {
  name = 'VidHide';

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

      // Try to extract the m3u8 link from the unpacked data
      const links = unpackedData.match(/sources:\[\{file:"(.*?)"/);
      if (!links || !links[1]) {
        throw new Error('Could not extract video source from unpacked data');
      }

      const m3u8Link = links[1];
      const m3u8Content = await axiosClient.get(m3u8Link, {
        headers: {
          Referer: m3u8Link,
        },
      });

      sources.push({
        url: m3u8Link,
        isM3U8: m3u8Link.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      if (m3u8Content.data.includes('EXTM3U')) {
        const pathWithoutMaster = m3u8Link.split('/master.m3u8')[0];
        const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
        for (const video of videoList ?? []) {
          if (!video.includes('m3u8')) continue;

          const url = video.split('\n')[1];
          const quality = video
            .split('RESOLUTION=')[1]
            ?.split(',')[0]
            .split('x')[1];

          sources.push({
            url: `${pathWithoutMaster}/${url}`,
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

class VidHideInfo implements ExtractorInfo {
  id: string = 'vidhide';
  patterns: RegExp[] = [/vidhide\./, /geonode\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new VidHide()];
}

export default VidHideInfo;
