import {type CheerioAPI, load} from 'cheerio';

// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/voe.ts

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {parseURL, resolveURL} from '../../../../../../../core/utils/urlUtils';
import {Subtitle} from '../../../../../../../features/plugins/data/model/media/Subtitle';

class Voe implements Extractor {
  name = 'voe';

  private readonly domains = ['voe.sx'];

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const res = await axiosClient.get(data.url);
      const $ = load(res.data);
      const scriptContent = $('script').html();
      const pageUrl = scriptContent
        ? scriptContent.match(
            /window\.location\.href\s*=\s*'(https:\/\/[^']+)';/,
          )?.[1] ?? ''
        : '';

      const {data: pageData} = await axiosClient.get(pageUrl);
      const $$ = load(pageData);
      const bodyHtml = $$('body').html() || '';
      const url = bodyHtml.match(/'hls'\s*:\s*'([^']+)'/s)?.[1] || '';

      const subtitleRegex =
        /<track\s+kind="subtitles"\s+label="([^"]+)"\s+srclang="([^"]+)"\s+src="([^"]+)"/g;
      let subtitles: Subtitle[] = [];
      let match;
      while ((match = subtitleRegex.exec(bodyHtml)) !== null) {
        subtitles.push({
          language: match[1]!,
          url: resolveURL(match[3]!, data.url),
        });
      }

      let thumbnailSrc: string = '';
      $$('script').each((i: number, el: any) => {
        const scriptContent = $(el).html();
        const regex = /previewThumbnails:\s*{[^}]*src:\s*\["([^"]+)"\]/;
        if (scriptContent) {
          const match = scriptContent.match(regex);
          if (match && match[1]) {
            thumbnailSrc = match[1];
            return false;
          }
        }
      });
      if (thumbnailSrc) {
        subtitles.push({
          language: 'thumbnails',
          url: `${parseURL(data.url).origin}${thumbnailSrc}`,
        });
      }

      sources.push({
        url: atob(url),
        isM3U8: atob(url).includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return sources;
    } catch (err) {
      console.log(err);
      throw new Error((err as Error).message);
    }
  };
}

class VoeInfo implements ExtractorInfo {
  id: string = 'voe';
  patterns: RegExp[] = [/voe\.sx/];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new Voe()];
}

export default VoeInfo;
