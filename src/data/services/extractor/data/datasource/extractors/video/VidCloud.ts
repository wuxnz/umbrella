// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/vidcloud.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL} from '../../../../../../../core/utils/urlUtils';
import {Subtitle} from '../../../../../../../features/plugins/data/model/media/Subtitle';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

class VidCloud implements Extractor {
  name = 'VidCloud';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    try {
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: videoUrl.href,
          'User-Agent': USER_AGENT,
        },
      };

      // Note: This extractor previously used getSources from NativeConsumet which is not available
      // This is a simplified version that may need to be updated based on actual usage
      const response = await axiosClient.get(data.url, options);

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

      // If we found m3u8 sources, try to get different qualities
      for (const source of sources) {
        if (source.isM3U8) {
          try {
            const {data: m3u8Data} = await axiosClient.get(source.url, options);
            const urls = m3u8Data
              .split('\n')
              .filter(
                (line: string) =>
                  line.includes('.m3u8') || line.endsWith('m3u8'),
              ) as string[];
            const qualities = m3u8Data
              .split('\n')
              .filter((line: string) =>
                line.includes('RESOLUTION='),
              ) as string[];

            const qualityUrls = qualities.map((s, i) => {
              const quality = s.split('x')[1];
              const url = urls[i];
              return [quality, url];
            });

            for (const [quality, url] of qualityUrls) {
              if (url) {
                sources.push({
                  url: url,
                  isM3U8: url.includes('.m3u8'),
                  name: this.name,
                  type: MediaType.RawVideo,
                });
              }
            }
          } catch (err) {
            // Continue if we can't parse the m3u8
          }
        }
      }

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class VidCloudInfo implements ExtractorInfo {
  id: string = 'vidcloud';
  patterns: RegExp[] = [/vidcloud\./, /vidsrc\.stream/];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new VidCloud()];
}

export default VidCloudInfo;
