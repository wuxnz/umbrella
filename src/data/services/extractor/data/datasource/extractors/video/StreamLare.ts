// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/streamlare.ts

import {type CheerioAPI, load} from 'cheerio';

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

class StreamLare implements Extractor {
  name = 'StreamLare';

  private readonly host = 'https://streamlare.com';
  private readonly regex = new RegExp('/[ve]/([^?#&/]+)');
  private readonly USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const {data: responseData} = await axiosClient.get(data.url);

      // Extract packed JavaScript safely without eval()
      const evalMatch = /(eval)(\(f.*?)(\n<\/script>)/s.exec(responseData);
      if (!evalMatch || !evalMatch[2]) {
        throw new Error('Could not find packed JavaScript code');
      }

      const packedCode = evalMatch[2]
        .replace('eval', '')
        .replace(/^\(|\)$/g, '');
      const unpackedData = safeUnpack(packedCode);

      const links = unpackedData.match(/sources:\[\{src:"(.*?)"/g) || [];

      for (const linkMatch of links) {
        const linkUrl = linkMatch.match(/src:"(.*?)"/)?.[1];
        if (linkUrl) {
          sources.push({
            url: linkUrl,
            isM3U8: linkUrl.includes('.m3u8'),
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

class StreamLareInfo implements ExtractorInfo {
  id: string = 'streamlare';
  patterns: RegExp[] = [/streamlare\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new StreamLare()];
}

export default StreamLareInfo;
