import {AxiosResponse} from 'axios';
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
      let success = false;
      let response: AxiosResponse | null = null;
      let maxRetries = 5;
      while (!success && maxRetries > 0) {
        const playerResponse = await axiosClient.get(data.url, {
          headers: {
            Referer: data.url,
            'Content-Type': 'application/x-www-form-urlencoded',
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
        response = await axiosClient.post(ajaxUrl, postData, {
          headers: {
            Referer: data.url,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        success = response!.data.success;
        maxRetries--;
      }
      if (!response) {
        console.error('Failed to get player data');
        return [];
      }
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
