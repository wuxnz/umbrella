import axiosClient from '../../../../../../../core/utils/network/axios';
import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Subtitle} from '../../../../../../../features/plugins/data/model/media/Subtitle';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';

class JWPlayer implements Extractor {
  name: string = 'JWPlayer';
  async execute(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> {
    try {
      const playerResponse = await axiosClient.get(data.url, {
        headers: {
          Host: new URL(data.url).hostname,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          Referer: data.url,
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: new URL(data.url).origin,
          DNT: '1',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
        },
      });
      console.log(playerResponse.data);

      const videoIdRegex = /\|iframe\|(.*?)\|video_id/;
      const videoId =
        playerResponse.data
          .match(videoIdRegex)[1]
          .split('|')
          .reverse()
          .join('+') + '=';
      console.log(videoId);
      const playerNonceRegex = /\|autoPlay\|(.*?)\|playerNonce/;
      const playerNonce = playerResponse.data.match(playerNonceRegex)[1];
      console.log(playerNonce);
      const ajaxUrl = new URL(data.url).origin + '/wp-admin/admin-ajax.php';
      console.log(ajaxUrl);
      const postData = `action=get_player_data&video_id=${videoId}&player_nonce=${playerNonce}`;
      console.log(postData);
      const response = await axiosClient.post(ajaxUrl, postData, {
        headers: {
          Host: new URL(data.url).hostname,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
          Accept: '*/*',
          Referer: data.url,
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: new URL(data.url).origin,
          DNT: '1',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
      });
      console.log(response.data);
      if (!response.data || !response.data.success) {
        console.error('Failed to get player data:', response.data);
        return [];
      }

      const subtitles: Subtitle[] = response.data.subtitles.map(
        (subtitle: any) => ({
          url: subtitle.file,
          language: subtitle.label,
        }),
      );
      const sources: RawVideo[] = response.data.sources.map((source: any) => ({
        url: source.file,
        isM3U8: source.type === 'hls',
        name: this.name,
        type: MediaType.RawVideo,
        subtitles: subtitles,
        headers: {
          Referer: data.url,
        },
      }));
      console.log(sources);
      return sources;
    } catch (error) {
      return [];
    }
  }
}

class JWPlayerInfo implements ExtractorInfo {
  id: string = 'jw-player';
  patterns: RegExp[] = [/s3taku\./];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new JWPlayer()];
}

export default JWPlayerInfo;
