// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/filemoon.ts

import {type CheerioAPI, load} from 'cheerio';

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL} from '../../../../../../../core/utils/urlUtils';
import {safeUnpack} from '../../../../../../../core/utils/jsUnpacker';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

/**
 * work in progress
 */
class Filemoon implements Extractor {
  name = 'Filemoon';

  private readonly host = 'https://filemoon.sx';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    const options = {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        Cookie:
          'file_id=40342338; aff=23788; ref_url=https%3A%2F%2Fbf0skv.org%2Fe%2Fm0507zf4xqor; lang=1',
        Priority: 'u=0, i',
        Referer: videoUrl.origin,
        Origin: data.url,
        'Sec-Ch-Ua':
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'iframe',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': USER_AGENT,
        'Access-Control-Allow-Origin': '*',
      },
    };

    const {data: responseData} = await axiosClient.get(data.url, options);
    const $ = load(responseData);
    try {
      const iframeSrc = $('iframe').attr('src');
      if (!iframeSrc) {
        throw new Error('Could not find iframe source');
      }

      const {data: iframeData} = await axiosClient.get(iframeSrc, options)!;

      // Extract packed JavaScript safely without eval()
      const evalMatch = /(eval)(\(f.*?)(\n<\/script>)/s.exec(iframeData);
      if (!evalMatch || !evalMatch[2]) {
        throw new Error('Could not find packed JavaScript code');
      }

      const packedCode = evalMatch[2]
        .replace('eval', '')
        .replace(/^\(|\)$/g, '');
      const unpackedData = safeUnpack(packedCode);

      const links = unpackedData.match(/sources:\[\{file:"(.*?)"/);
      if (!links || !links[1]) {
        throw new Error('Could not extract video source from unpacked data');
      }

      const m3u8Link = links[1];
      sources.unshift({
        url: m3u8Link,
        isM3U8: true,
        name: this.name,
        type: MediaType.RawVideo,
      });
    } catch (err) {
      console.log(err);
    }
    return sources;
  };
}

class FilemoonInfo implements ExtractorInfo {
  id: string = 'filemoon';
  patterns: RegExp[] = [/filemoon\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new Filemoon()];
}

export default FilemoonInfo;
