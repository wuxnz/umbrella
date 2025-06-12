// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/smashystream.ts

import CryptoJS from 'crypto-js';
import {type CheerioAPI, load} from 'cheerio';

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';
import {Subtitle} from '../../../../../../../features/plugins/data/model/media/Subtitle';

// Copied form https://github.com/JorrinKievit/restreamer/blob/main/src/main/extractors/smashystream.ts/smashystream.ts
// Thanks Jorrin Kievit
class SmashyStream implements Extractor {
  name = 'SmashyStream';

  private readonly host = 'https://embed.smashystream.com';

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      const result: {
        source: string;
        data: {sources: RawVideo[]} & {subtitles: Subtitle[]};
      }[] = [];

      const {data: responseData} = await axiosClient.get(data.url);
      const $ = load(responseData);

      const sourceUrls = $('.dropdown-menu a[data-id]')
        .map((_: number, el: any) => $(el).attr('data-id'))
        .get()
        .filter((it: string) => it !== '_default');

      await Promise.all(
        sourceUrls.map(async (sourceUrl: string) => {
          if (sourceUrl.includes('/ffix')) {
            const extractedData = await this.extractSmashyFfix(sourceUrl);
            result.push({
              source: 'FFix',
              data: extractedData,
            });
          }

          if (sourceUrl.includes('/watchx')) {
            const extractedData = await this.extractSmashyWatchX(sourceUrl);
            result.push({
              source: 'WatchX',
              data: extractedData,
            });
          }

          if (sourceUrl.includes('/nflim')) {
            const extractedData = await this.extractSmashyNFlim(sourceUrl);
            result.push({
              source: 'NFilm',
              data: extractedData,
            });
          }

          if (sourceUrl.includes('/fx')) {
            const extractedData = await this.extractSmashyFX(sourceUrl);
            result.push({
              source: 'FX',
              data: extractedData,
            });
          }

          if (sourceUrl.includes('/cf')) {
            const extractedData = await this.extractSmashyCF(sourceUrl);
            result.push({
              source: 'CF',
              data: extractedData,
            });
          }

          if (sourceUrl.includes('eemovie')) {
            const extractedData = await this.extractSmashyEEMovie(sourceUrl);
            result.push({
              source: 'EEMovie',
              data: extractedData,
            });
          }

          return undefined;
        }),
      );

      const ffixResult = result.find(a => a.source === 'FFix');
      if (!ffixResult) {
        throw new Error('FFix source not found');
      }
      return ffixResult.data.sources;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  async extractSmashyFfix(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });
      const config = JSON.parse(
        res.data.match(/var\s+config\s*=\s*({.*?});/)[1],
      );

      const files = config.file
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: string) => {
          const match = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          if (!match) return null;
          const [, quality, link] = match;
          return {quality, link: link.replace(',', '')};
        })
        .filter(
          (item: any): item is {quality: string; link: string} => item !== null,
        );

      const vttArray = config.subtitle
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: string) => {
          const match = entry.match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/);
          if (!match) return null;
          const [, language, link] = match;
          return {language, link: link.replace(',', '')};
        })
        .filter(
          (item: any): item is {language: string; link: string} =>
            item !== null,
        );

      files.forEach((source: {link: string; quality: string}) => {
        result.sources.push({
          url: source.link,
          isM3U8: source.link.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      vttArray.forEach((subtitle: {language: string; link: string}) => {
        result.subtitles.push({
          url: subtitle.link,
          language: subtitle.language,
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyWatchX(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const key = '4VqE3#N7zt&HEP^a';

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /MasterJS\s*=\s*'([^']*)'/;
      const regexMatch = regex.exec(res.data);

      if (!regexMatch || !regexMatch[1]) {
        throw new Error('Failed to extract MasterJS data');
      }

      const base64EncryptedData = regexMatch[1];
      const base64DecryptedData = JSON.parse(
        Buffer.from(base64EncryptedData, 'base64').toString('utf8'),
      );

      const derivedKey = CryptoJS.PBKDF2(
        key,
        CryptoJS.enc.Hex.parse(base64DecryptedData.salt),
        {
          keySize: 32 / 4,
          iterations: base64DecryptedData.iterations,
          hasher: CryptoJS.algo.SHA512,
        },
      );
      const decipher = CryptoJS.AES.decrypt(
        base64DecryptedData.ciphertext,
        derivedKey,
        {
          iv: CryptoJS.enc.Hex.parse(base64DecryptedData.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        },
      );
      const decrypted = decipher.toString(CryptoJS.enc.Utf8);

      const sources = JSON.parse(decrypted.match(/sources: ([^\]]*\])/)![1]!);
      const tracks = JSON.parse(decrypted.match(/tracks: ([^]*?\}\])/)![1]!);

      const subtitles = tracks.filter(
        (it: {file: string; label: string; kind: string}) =>
          it.kind === 'captions',
      );

      sources.map((source: {file: string; label: string}) => {
        result.sources.push({
          url: source.file,
          isM3U8: source.file.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      subtitles.map((subtitle: {file: string; label: string}) => {
        result.subtitles.push({
          url: subtitle.file,
          language: subtitle.label,
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyNFlim(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /var\s+config\s*=\s*({.*?});/;
      const regexMatch = regex.exec(res.data);

      if (!regexMatch || !regexMatch[1]) {
        throw new Error('Failed to extract config data');
      }

      const config = JSON.parse(regexMatch[1]);

      const files = config.file
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: {match: (arg0: RegExp) => [string, string, string]}) => {
          const [, quality, link] = entry.match(
            /\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/,
          );
          return {quality, link: link.replace(',', '')};
        });

      const vttArray = config.subtitle
        .match(/\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/g)
        .map((entry: {match: (arg0: RegExp) => [string, string, string]}) => {
          const [, language, link] = entry.match(
            /\[([^\]]+)\](https?:\/\/\S+?)(?=,\[|$)/,
          );
          return {language, link: link.replace(',', '')};
        });

      files.map((source: {link: string; quality: string}) => {
        result.sources.push({
          url: source.link,
          isM3U8: source.link.includes('.m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      vttArray.map((subtitle: {language: string; link: string}) => {
        result.subtitles.push({
          url: subtitle.link,
          language: subtitle.language,
        });
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyFX(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /var\s+config\s*=\s*({.*?});/;
      const regexMatch = regex.exec(res.data);

      if (!regexMatch || !regexMatch[1]) {
        throw new Error('Failed to extract config data');
      }

      const config = JSON.parse(regexMatch[1]);

      result.sources.push({
        url: config.file,
        isM3U8: config.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyCF(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /var\s+config\s*=\s*({.*?});/;
      const regexMatch = regex.exec(res.data);

      if (!regexMatch || !regexMatch[1]) {
        throw new Error('Failed to extract config data');
      }

      const config = JSON.parse(regexMatch[1]);

      result.sources.push({
        url: config.file,
        isM3U8: config.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async extractSmashyEEMovie(
    url: string,
  ): Promise<{sources: RawVideo[]} & {subtitles: Subtitle[]}> {
    try {
      const result: {sources: RawVideo[]; subtitles: Subtitle[]} = {
        sources: [],
        subtitles: [],
      };

      const res = await axiosClient.get(url, {
        headers: {
          referer: url,
        },
      });

      const regex = /var\s+config\s*=\s*({.*?});/;
      const regexMatch = regex.exec(res.data);

      if (!regexMatch || !regexMatch[1]) {
        throw new Error('Failed to extract config data');
      }

      const config = JSON.parse(regexMatch[1]);

      result.sources.push({
        url: config.file,
        isM3U8: config.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });

      return result;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

class SmashyStreamInfo implements ExtractorInfo {
  id: string = 'smashystream';
  patterns: RegExp[] = [/smashystream\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new SmashyStream()];
}

export default SmashyStreamInfo;
