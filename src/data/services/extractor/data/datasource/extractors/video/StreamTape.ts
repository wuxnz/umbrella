import {type CheerioAPI, load} from 'cheerio';

// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/streamtape.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';

class StreamTape implements Extractor {
  name = 'StreamTape';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const {data: responseData} = await axiosClient.get(data.url).catch(() => {
        throw new Error('Video not found');
      });

      const $ = load(responseData);

      let [fh, sh] = $.html()
        ?.match(/robotlink'\).innerHTML = (.*)'/)![1]!
        .split("+ ('");

      sh = sh?.substring(3);
      fh = fh?.replace(/\'/g, '');

      const url = `https:${fh}${sh}`;

      sources.push({
        url: url,
        isM3U8: url.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class StreamTapeInfo implements ExtractorInfo {
  id: string = 'streamtape';
  patterns: RegExp[] = [/streamtape\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new StreamTape()];
}

export default StreamTapeInfo;
