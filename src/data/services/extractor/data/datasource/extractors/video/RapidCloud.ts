import {type CheerioAPI, load} from 'cheerio';
// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/rapidcloud.ts

import CryptoJS from 'crypto-js';

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

const substringAfter = (str: string, delimiter: string): string => {
  const index = str.indexOf(delimiter);
  return index === -1 ? '' : str.substring(index + delimiter.length);
};

const substringBefore = (str: string, delimiter: string): string => {
  const index = str.indexOf(delimiter);
  return index === -1 ? str : str.substring(0, index);
};

class RapidCloud implements Extractor {
  name = 'RapidCloud';

  private readonly fallbackKey = 'c1d17096f2ca11b7';
  private readonly host = 'https://rapid-cloud.co';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];
    const videoUrl = parseURL(data.url);

    try {
      const id = data.url.split('/').pop()?.split('?')[0];
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };

      let res = null;

      res = await axiosClient.get(
        `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
        options,
      );

      let {
        data: {sources: sourcesData, tracks, intro, outro, encrypted},
      } = res;

      let decryptKey = await (
        await axiosClient.get(
          'https://raw.githubusercontent.com/cinemaxhq/keys/e1/key',
        )
      ).data;

      decryptKey = substringBefore(
        substringAfter(decryptKey, '"blob-code blob-code-inner js-file-line">'),
        '</td>',
      );

      if (!decryptKey) {
        decryptKey = await (
          await axiosClient.get(
            'https://raw.githubusercontent.com/cinemaxhq/keys/e1/key',
          )
        ).data;
      }

      if (!decryptKey) decryptKey = this.fallbackKey;

      try {
        if (encrypted) {
          const sourcesArray = sourcesData.split('');

          let extractedKey = '';
          let currentIndex = 0;
          for (const index of decryptKey) {
            const start = index[0] + currentIndex;
            const end = start + index[1];
            for (let i = start; i < end; i++) {
              extractedKey += res.data.sources[i];
              sourcesArray[i] = '';
            }
            currentIndex += index[1];
          }

          decryptKey = extractedKey;
          sourcesData = sourcesArray.join('');

          const decrypt = CryptoJS.AES.decrypt(sourcesData, decryptKey);
          sourcesData = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        }
      } catch (err) {
        throw new Error('Cannot decrypt sources. Perhaps the key is invalid.');
      }

      sourcesData?.forEach((s: any) => {
        sources.push({
          url: s.file,
          isM3U8: s.file.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      if (data.url.includes(parseURL(this.host).hostname)) {
        for (const source of sourcesData) {
          const {data: m3u8Data} = await axiosClient.get(source.file, options);
          const m3u8Lines = m3u8Data
            .split('\n')
            .filter(
              (line: string) =>
                line.includes('.m3u8') && line.includes('RESOLUTION='),
            );

          const secondHalf = m3u8Lines.map((line: string) =>
            line
              .match(/RESOLUTION=.*,(C)|URI=.*/g)
              ?.map((s: string) => s.split('=')[1]),
          );

          const TdArray = secondHalf.map((s: string[]) => {
            const f1 = s[0]?.split(',C')[0];
            const f2 = s[1]?.replace(/"/g, '');

            return [f1, f2];
          });
          for (const [f1, f2] of TdArray) {
            sources.push({
              url: `${source.file?.split('master.m3u8')[0]}${f2.replace(
                'iframes',
                'index',
              )}`,
              isM3U8: f2.includes('.m3u8'),
              name: this.name,
              type: MediaType.RawVideo,
            });
          }
        }
      }

      sources.push({
        url: sourcesData[0].file,
        isM3U8: sourcesData[0].file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      const subtitles: Subtitle[] = tracks
        .map((s: any) =>
          s.file
            ? {
                url: s.file,
                language: s.label ? s.label : 'Thumbnails',
              }
            : null,
        )
        .filter((s: any) => s);

      return sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  private captcha = async (url: string, key: string): Promise<string> => {
    const uri = parseURL(url);
    const domain = uri.protocol + '//' + uri.hostname;

    const {data} = await axiosClient.get(
      `https://www.google.com/recaptcha/api.js?render=${key}`,
      {
        headers: {
          Referer: domain,
        },
      },
    );

    const v = data
      ?.substring(data.indexOf('/releases/'), data.lastIndexOf('/recaptcha'))
      .split('/releases/')[1];

    //TODO: NEED to fix the co (domain) parameter to work with every domain
    const anchor = `https://www.google.com/recaptcha/api2/anchor?ar=1&hl=en&size=invisible&cb=kr42069kr&k=${key}&co=aHR0cHM6Ly9yYXBpZC1jbG91ZC5ydTo0NDM.&v=${v}`;
    const c = load((await axiosClient.get(anchor)).data)(
      '#recaptcha-token',
    ).attr('value');

    // currently its not returning proper response. not sure why
    const res = await axiosClient.post(
      `https://www.google.com/recaptcha/api2/reload?k=${key}`,
      {
        v: v,
        k: key,
        c: c,
        co: 'aHR0cHM6Ly9yYXBpZC1jbG91ZC5ydTo0NDM.',
        sa: '',
        reason: 'q',
      },
      {
        headers: {
          Referer: anchor,
        },
      },
    );

    return res.data.substring(
      res.data.indexOf('rresp","'),
      res.data.lastIndexOf('",null'),
    );
  };
}

class RapidCloudInfo implements ExtractorInfo {
  id: string = 'rapidcloud';
  patterns: RegExp[] = [/rapid-cloud\./, /rapidcloud\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new RapidCloud()];
}

export default RapidCloudInfo;
