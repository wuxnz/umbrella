// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/asianload.ts

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

class AsianLoad implements Extractor {
  name = 'asianload';
  protected sources: RawVideo[] = [];

  private readonly keys = {
    key: CryptoJS.enc.Utf8.parse('93422192433952489752342908585752'),
    iv: CryptoJS.enc.Utf8.parse('9262859232435825'),
  };

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const videoUrl = parseURL(data.url);
    const res = await axiosClient.get(videoUrl.href);
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

    decryptedData.source.forEach((source: any) => {
      this.sources.push({
        url: source.file,
        isM3U8: source.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
      });
    });

    const subtitles = decryptedData.track?.tracks?.map(
      (track: any): Subtitle => ({
        url: track.file,
        language: track.kind === 'thumbnails' ? 'Default (maybe)' : track.kind,
      }),
    );

    decryptedData.source_bk.forEach((source: any) => {
      this.sources.push({
        url: source.file,
        isM3U8: source.file.includes('.m3u8'),
        name: this.name,
        type: MediaType.RawVideo,
        subtitles: subtitles,
      });
    });

    return this.sources;
  };
  private generateEncryptedAjaxParams = async (
    $: CheerioAPI,
    id: string,
  ): Promise<string> => {
    const encryptedKey = CryptoJS.AES.encrypt(id, this.keys.key, {
      iv: this.keys.iv,
    }).toString();

    const scriptValue = $("script[data-name='crypto']").data().value as string;

    const decryptedToken = CryptoJS.AES.decrypt(scriptValue, this.keys.key, {
      iv: this.keys.iv,
    }).toString(CryptoJS.enc.Utf8);

    return `id=${encryptedKey}&alias=${decryptedToken}`;
  };

  private decryptAjaxData = async (encryptedData: string): Promise<any> => {
    const decryptedData = CryptoJS.enc.Utf8.stringify(
      CryptoJS.AES.decrypt(encryptedData, this.keys.key, {
        iv: this.keys.iv,
      }),
    );

    return JSON.parse(decryptedData);
  };
}

class AsianLoadInfo implements ExtractorInfo {
  id: string = 'asianload';
  patterns: RegExp[] = [/asianload.*?\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new AsianLoad()];
}

export default AsianLoadInfo;
