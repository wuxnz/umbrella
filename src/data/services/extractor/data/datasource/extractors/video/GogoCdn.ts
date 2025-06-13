// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/gogocdn.ts

import {type CheerioAPI, load} from 'cheerio';
import CryptoJS from 'crypto-js';

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {
  parseURL,
  getURLParameter,
} from '../../../../../../../core/utils/urlUtils';
import {Subtitle} from '../../../../../../../features/plugins/data/model/media/Subtitle';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

class GogoCDN implements Extractor {
  name = 'goload';

  private readonly keys = {
    key: CryptoJS.enc.Utf8.parse('37911490979715163134003223491201'),
    secondKey: CryptoJS.enc.Utf8.parse('54674138327930866480207815084989'),
    iv: CryptoJS.enc.Utf8.parse('3134003223491201'),
  };

  private referer: string = '';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);
    this.referer = data.url;

    const res = await axiosClient.get(data.url);
    const $ = load(res.data);

    const encyptedParams = await this.generateEncryptedAjaxParams(
      $,
      getURLParameter(data.url, 'id') ?? '',
    );

    const encryptedData = await axiosClient.get(
      `${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?${encyptedParams}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
    );
    const decryptedData = await this.decryptAjaxData(encryptedData.data.data);

    if (!decryptedData.source)
      throw new Error('No source found. Try a different server.');

    const subtitles: Subtitle[] = decryptedData.track.tracks?.map(
      (track: any) => ({
        url: track.file,
        language: track.kind,
      }),
    );

    if (decryptedData.source[0].file.includes('.m3u8')) {
      const resResult = await axiosClient.get(
        decryptedData.source[0].file.toString(),
      );
      const resolutions = resResult.data.match(
        /(RESOLUTION=)(.*)(\s*?)(\s*.*)/g,
      );
      resolutions?.forEach((res: string) => {
        const index = decryptedData.source[0].file.lastIndexOf('/');
        const quality = res.split('\n')[0]?.split('x')[1]?.split(',')[0];
        const url = decryptedData.source[0].file.slice(0, index);
        sources.push({
          url: url + '/' + res.split('\n')[1],
          isM3U8: (url + res.split('\n')[1]).includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      decryptedData.source.forEach((source: any) => {
        sources.push({
          url: source.file,
          isM3U8: source.file.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });
    } else
      decryptedData.source.forEach((source: any) => {
        sources.push({
          url: source.file,
          isM3U8: source.file.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

    decryptedData.source_bk.forEach((source: any) => {
      sources.push({
        url: source.file,
        isM3U8: source.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });
    });

    return sources;
  };

  private addSources = async (source: any) => {
    const sources: RawVideo[] = [];

    if (source.file.includes('m3u8')) {
      const m3u8Urls = await axiosClient
        .get(source.file, {
          headers: {
            Referer: this.referer,
            'User-Agent': USER_AGENT,
          },
        })
        .catch(() => null);

      const videoList = m3u8Urls?.data.split('#EXT-X-I-FRAME-STREAM-INF:');
      for (const video of videoList ?? []) {
        if (!video.includes('m3u8')) continue;

        const url = video
          .split('\n')
          .find((line: any) => line.includes('URI='))
          .split('URI=')[1]
          .replace(/"/g, '');

        const quality = video
          .split('RESOLUTION=')[1]
          .split(',')[0]
          .split('x')[1];

        sources.push({
          url: url,
          isM3U8: true,
          name: this.name,
          type: MediaType.RawVideo,
        });
      }

      return;
    }
    sources.push({
      url: source.file,
      isM3U8: source.file.includes('.m3u8'),
      name: this.name,
      type: MediaType.RawVideo,
    });
  };

  private generateEncryptedAjaxParams = async (
    $: CheerioAPI,
    id: string,
  ): Promise<string> => {
    const encryptedKey = CryptoJS.AES.encrypt(id, this.keys.key, {
      iv: this.keys.iv,
    });

    const scriptValue = $("script[data-name='episode']").attr(
      'data-value',
    ) as string;

    const decryptedToken = CryptoJS.AES.decrypt(scriptValue, this.keys.key, {
      iv: this.keys.iv,
    }).toString(CryptoJS.enc.Utf8);

    return `id=${encryptedKey}&alias=${id}&${decryptedToken}`;
  };

  private decryptAjaxData = async (encryptedData: string): Promise<any> => {
    const decryptedData = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(encryptedData, this.keys.secondKey, {
        iv: this.keys.iv,
      }),
    );

    return JSON.parse(decryptedData);
  };
}

class GogoCDNInfo implements ExtractorInfo {
  id: string = 'gogocdn';
  patterns: RegExp[] = [/goload\./, /gogohd\./, /gogocdn\./, /gogoanime\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new GogoCDN()];
}

export default GogoCDNInfo;
