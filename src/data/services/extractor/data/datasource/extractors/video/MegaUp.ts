// Original code by 2004durgesh: https://github.com/2004durgesh
// Credit for the original code: https://github.com/2004durgesh/react-native-consumet
// Original Code : https://github.com/2004durgesh/react-native-consumet/blob/main/src/extractors/megaup.ts

//extractor for https://animekai.to

// Keys required for the decryption to work are loaded dynamically from
// https://raw.githubusercontent.com/amarullz/kaicodex/main/generated/keys.json

import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';
import axiosClient from '../../../../../../../core/utils/network/axios';

export class MegaUp implements Extractor {
  name = 'MegaUp';
  private homeKeys: string[] = [];
  private megaKeys: string[] = [];
  private kaiKeysReady: Promise<void> | null = null;

  constructor() {
    // Don't load keys in constructor to avoid network requests on app startup
  }

  private async loadKAIKEYS(): Promise<void> {
    const extraction_keys =
      'https://raw.githubusercontent.com/amarullz/kaicodex/main/generated/keys.json';

    const response = await axiosClient.get(extraction_keys);
    const keys = await response.data;

    for (var i = 0; i < keys.kai.length; i++) {
      this.homeKeys.push(atob(keys.kai[i]));
    }
    for (var i = 0; i < keys.mega.length; i++) {
      this.megaKeys.push(atob(keys.mega[i]));
    }
  }

  private keysChar =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-~!*()'.".split(
      '',
    );

  GenerateToken = (n: string) => {
    n = encodeURIComponent(n);
    const l = n.length;
    let o = [];
    for (var i = 0; i < l; i++) {
      const kc = this.homeKeys[this.keysChar.indexOf(n.charAt(i))];
      const c = kc?.charAt(i % kc.length!);
      o.push(c);
    }
    return btoa(o.join(''))
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/\=/g, '');
  };

  DecodeIframeData = (n: string) => {
    n = atob(n.replace(/_/g, '/').replace(/-/g, '+'));
    const l = n.length;
    let o = [];
    for (var i = 0; i < l; i++) {
      const c = n.charCodeAt(i);
      const k = this.megaKeys[c];
      o.push(k?.charCodeAt(i % k.length!));
    }
    return decodeURIComponent(
      String.fromCharCode.apply(
        null,
        o.filter(val => val !== undefined) as number[],
      ),
    );
  };

  Decode = (n: string) => {
    n = atob(n.replace(/_/g, '/').replace(/-/g, '+'));
    const l = n.length;
    let o = [];
    for (var i = 0; i < l; i++) {
      const c = n.charCodeAt(i);
      let cp = '';
      for (var j = 0; j < this.homeKeys.length; j++) {
        var ck = this.homeKeys[j]?.charCodeAt(i % this.homeKeys[j]?.length!);
        if (ck === c) {
          cp = this.keysChar[j]!;
          break;
        }
      }
      if (cp) {
        o.push(cp);
      } else {
        o.push('%');
      }
    }
    return decodeURIComponent(o.join(''));
  };

  execute = async (
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> => {
    const sources: RawVideo[] = [];

    try {
      // Lazy load keys only when extractor is actually used
      if (!this.kaiKeysReady) {
        this.kaiKeysReady = this.loadKAIKEYS();
      }
      await this.kaiKeysReady;

      const url = data.url.replace(/\/(e|e2)\//, '/media/');
      const res = await axiosClient.get(url);
      const decrypted = JSON.parse(
        this.DecodeIframeData(res.data.result).replace(/\\/g, ''),
      );

      decrypted.sources.forEach((s: {file: string}) => {
        sources.push({
          url: s.file,
          isM3U8: s.file.includes('.m3u8') || s.file.endsWith('m3u8'),
          name: this.name,
          type: MediaType.RawVideo,
        });
      });

      return sources;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}

class MegaUpInfo implements ExtractorInfo {
  id: string = 'megaup';
  patterns: RegExp[] = [/megaup\./, /animekai\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new MegaUp()];
}

export default MegaUpInfo;
