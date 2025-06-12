// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/mixdrop.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

class MixDrop implements Extractor {
  name = 'MixDrop';

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
      const formated = safeUnpack(packedCode);

      const matches = formated.match(/poster="([^"]+)"|wurl="([^"]+)"/g);
      if (!matches || matches.length < 2) {
        throw new Error('Could not extract video source from unpacked data');
      }

      const [poster, source] = matches
        .map((x: string) => x.split('="')[1]!.replace(/"/g, ''))
        .map((x: string) => (x.startsWith('http') ? x : `https:${x}`));

      sources.push({
        url: source,
        isM3U8: source.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class MixDropInfo implements ExtractorInfo {
  id: string = 'mixdrop';
  patterns: RegExp[] = [/mixdrop\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new MixDrop()];
}

export default MixDropInfo;
