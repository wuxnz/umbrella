// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/streamwish.ts

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

class StreamWish implements Extractor {
  name = 'streamwish';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    try {
      const options = {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Encoding': '*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'max-age=0',
          Priority: 'u=0, i',
          Origin: videoUrl.origin,
          Referer: videoUrl.origin,
          'Sec-Ch-Ua':
            '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': 'Windows',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': USER_AGENT,
        },
      };
      const {data: responseData} = await axiosClient.get(data.url, options);

      // Code adapted from Zenda-Cross (https://github.com/Zenda-Cross/vega-app/blob/main/src/lib/providers/multi/multiGetStream.ts)
      // Thank you to Zenda-Cross for the original implementation.

      const functionRegex =
        /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
      const match = functionRegex.exec(responseData);
      let p = '';
      if (match) {
        const params = match[1]?.split(',').map(param => param.trim());
        const encodedString = match[0];

        p = encodedString.split("',36,")?.[0]?.trim()!;
        const a = 36;
        let c = encodedString.split("',36,")[1]?.slice(2).split('|').length!;
        const k = encodedString.split("',36,")[1]?.slice(2).split('|')!;
        while (c--) {
          if (k[c]) {
            const regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
            p = p.replace(regex, k[c]!);
          }
        }

        // console.log('Decoded String:', p);
      } else {
        console.log('No match found');
      }
      let link = p.match(/https?:\/\/[^"]+?\.m3u8[^"]*/)![0];
      // console.log('Decoded Links:', link);
      const subtitleMatches =
        p?.match(
          /{file:"([^"]+)",(label:"([^"]+)",)?kind:"(thumbnails|captions)"/g,
        ) ?? [];
      // console.log(subtitleMatches, 'subtitleMatches');
      const subtitles: Subtitle[] = subtitleMatches.map(sub => {
        const lang = sub?.match(/label:"([^"]+)"/)?.[1] ?? '';
        const url = sub?.match(/file:"([^"]+)"/)?.[1] ?? '';
        const kind = sub?.match(/kind:"([^"]+)"/)?.[1] ?? '';
        if (kind.includes('thumbnail')) {
          return {
            language: kind,
            url: `https://streamwish.com${url}`,
          };
        }
        return {
          language: lang,
          url: url,
        };
      });
      if (link.includes('hls2"')) {
        link = link.replace('hls2"', '').replace(new RegExp('"', 'g'), '');
      }
      // Add query parameter manually since we can't use URL object
      const separator = link.includes('?') ? '&' : '?';
      const finalUrl = `${link}${separator}i=0.4`;

      sources.push({
        url: finalUrl,
        isM3U8: link.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      try {
        const m3u8Content = await axiosClient.get(sources[0]!.url, options);

        if (m3u8Content.data.includes('EXTM3U')) {
          const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
          for (const video of videoList ?? []) {
            if (!video.includes('m3u8')) continue;

            const url = link.split('master.m3u8')[0] + video.split('\n')[1];
            const quality = video
              .split('RESOLUTION=')[1]
              .split(',')[0]
              .split('x')[1];

            sources.push({
              url: url,
              isM3U8: url.includes('.m3u8'),
              name: this.name,
              type: MediaType.RawVideo,
            });
          }
        }
      } catch (e) {}

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

class StreamWishInfo implements ExtractorInfo {
  id: string = 'streamwish';
  patterns: RegExp[] = [/streamwish\./, /dhcplay\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new StreamWish()];
}

export default StreamWishInfo;
