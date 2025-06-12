// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/kwik.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

class Kwik implements Extractor {
  name = 'kwik';

  private readonly host = 'https://animepahe.ru/';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const response = await fetch(data.url, {
        headers: {Referer: this.host},
      });

      const responseData = await response.text();

      // Extract packed JavaScript safely without eval()
      const evalMatch = /(eval)(\(f.*?)(\n<\/script>)/s.exec(responseData);
      if (!evalMatch || !evalMatch[2]) {
        throw new Error('Could not find packed JavaScript code');
      }

      const packedCode = evalMatch[2]
        .replace('eval', '')
        .replace(/^\(|\)$/g, '');
      const unpackedData = safeUnpack(packedCode);

      const source = unpackedData.match(/https.*?m3u8/);
      if (!source || !source[0]) {
        throw new Error('Could not extract video source from unpacked data');
      }

      sources.push({
        url: source[0],
        isM3U8: source[0].includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class KwikInfo implements ExtractorInfo {
  id: string = 'kwik';
  patterns: RegExp[] = [/kwik\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new Kwik()];
}

export default KwikInfo;
