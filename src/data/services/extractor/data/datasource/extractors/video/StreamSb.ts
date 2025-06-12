// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/streamsb.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL} from '../../../../../../../core/utils/urlUtils';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

class StreamSB implements Extractor {
  name = 'streamsb';

  private readonly host = 'https://streamsss.net/sources50';
  // TODO: update host2
  private readonly host2 = 'https://watchsb.com/sources50';

  private PAYLOAD = (hex: string) =>
    `566d337678566f743674494a7c7c${hex}7c7c346b6767586d6934774855537c7c73747265616d7362/6565417268755339773461447c7c346133383438333436313335376136323337373433383634376337633465366534393338373136643732373736343735373237613763376334363733353737303533366236333463353333363534366137633763373337343732363536313664373336327c7c6b586c3163614468645a47617c7c73747265616d7362`;

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    let headers: any = {
      watchsb: 'sbstream',
      'User-Agent': USER_AGENT,
      Referer: videoUrl.href,
    };
    let id = videoUrl.href.split('/e/').pop();
    if (id?.includes('html')) id = id.split('.html')[0];
    const bytes = new TextEncoder().encode(id);

    const res = await axiosClient
      .get(`${this.host}/${this.PAYLOAD(Buffer.from(bytes).toString('hex'))}`, {
        headers,
      })
      .catch(() => null);

    if (!res?.data.stream_data)
      throw new Error('No source found. Try a different server.');

    headers = {
      'User-Agent': USER_AGENT,
      Referer: videoUrl.href.split('e/')[0],
    };
    const m3u8Urls = await axiosClient.get(res.data.stream_data.file, {
      headers,
    });

    const videoList = m3u8Urls.data.split('#EXT-X-STREAM-INF:');

    for (const video of videoList ?? []) {
      if (!video.includes('m3u8')) continue;

      const url = video.split('\n')[1];
      const quality = video.split('RESOLUTION=')[1].split(',')[0].split('x')[1];

      sources.push({
        url: url,
        isM3U8: true,
        name: this.name,
        type: MediaType.RawVideo,
      });
    }

    sources.push({
      url: res.data.stream_data.file,
      isM3U8: res.data.stream_data.file.includes('.m3u8'),
      name: this.name,
      type: MediaType.RawVideo,
    });

    return sources;
  };
}

class StreamSBInfo implements ExtractorInfo {
  id: string = 'streamsb';
  patterns: RegExp[] = [/streamsb\./, /watchsb\./, /streamsss\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new StreamSB()];
}

export default StreamSBInfo;
