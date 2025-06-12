// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/mp4player.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL} from '../../../../../../../core/utils/urlUtils';

class Mp4Player implements Extractor {
  name = 'mp4player';

  private readonly domains = ['mp4player.site'];

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    try {
      const response = await axiosClient.get(data.url);

      const matchData = response.data
        .match(new RegExp('(?<=sniff\\()(.*)(?=\\))'))[0]
        ?.replace(/\"/g, '')
        ?.split(',');

      const link = `https://${videoUrl.hostname}/m3u8/${matchData[1]}/${matchData[2]}/master.txt?s=1&cache=${matchData[7]}`;
      //const thumbnails = response.data.match(new RegExp('(?<=file":")(.*)(?=","kind)'))[0]?.replace(/\\/g, '');

      const m3u8Content = await axiosClient.get(link, {
        headers: {
          accept: '*/*',
          referer: data.url,
        },
      });

      if (m3u8Content.data.includes('EXTM3U')) {
        const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
        for (const video of videoList ?? []) {
          if (video.includes('BANDWIDTH')) {
            const url = video.split('\n')[1];
            const quality = video
              .split('RESOLUTION=')[1]
              .split('\n')[0]
              .split('x')[1];

            sources.push({
              url: url,
              isM3U8: url.includes('.m3u8'),
              name: this.name,
              type: MediaType.RawVideo,
            });
          }
        }
      }

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class Mp4PlayerInfo implements ExtractorInfo {
  id: string = 'mp4player';
  patterns: RegExp[] = [/mp4player\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new Mp4Player()];
}

export default Mp4PlayerInfo;
