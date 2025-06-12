import ExtractorAudio from '../../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../../domain/entities/ExtractorInfo';

class JWPlayer implements Extractor {
  name: string = 'JWPlayer';
  async execute(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> {
    try {
      const response = await fetch(data.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
        },
      })
        .then(response => response)
        .then(data => {
          return data.text();
        });
      if (!response) {
        return [];
      }
      const sourceRegex =
        /window\|(.*?)\|true\|.*?\|(.*?)\|playerNonce\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|ajaxUrl\|(.*?)\|video_id/;
      const sourceComponents = response.match(sourceRegex)!;
      const formData = new FormData();
      formData.append('action', 'get_player_data');
      formData.append(
        'video_id',
        sourceComponents[9].split('|').reverse().join('+'),
      );
      formData.append('player_nonce', sourceComponents[2]);
      var sourceResponse = await fetch(
        `${sourceComponents[8]}://${sourceComponents[7]}.${sourceComponents[6]}/${sourceComponents[5]}-${sourceComponents[1]}/${sourceComponents[1]}-${sourceComponents[4]}.${sourceComponents[3]}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Referer: data.url,
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
          },
        },
      ).then(response => response.json());
      if (sourceResponse['success'] === true) {
        return sourceResponse['sources'].map(
          (sourceData: any, index: number) => {
            return {
              url: sourceData['file'],
              name: `${this.name} - ${index + 1}`,
              type: MediaType.RawVideo,
              iconUrl:
                'https://s3taku.one/wp-content/uploads/2025/01/cropped-favicon-32x32.jpg',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
                Host: sourceData['file'].split(/\/_v.\//)[0],
                Referer: data.url,
              },
              subtitles: sourceResponse['subtitles'].map(
                (subtitleData: any, index: number) => {
                  if (subtitleData['kind'] === 'captions') {
                    return {
                      url: subtitleData['file'],
                      language: subtitleData['label'],
                    };
                  } else if (subtitleData['kind'] === 'thumbnails') {
                    return {
                      url: subtitleData['file'],
                      language: 'thumbnail',
                    };
                  }
                },
              ),
              // thumbnail: sourceResponse['subtitles'].map(
              //   (subtitleData: any, index: number) => {
              //     if (subtitleData['kind'] === 'thumbnails') {
              //       return {
              //         url: subtitleData['file'],
              //         language: subtitleData['label'],
              //       };
              //     }
              //   },
              // ),
            };
          },
        );
      }
      return [];
    } catch (error) {
      return [];
    }
  }
}

class JWPlayerInfo implements ExtractorInfo {
  id: string = 'jw-player';
  patterns: RegExp[] = [/s3taku\.one/];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new JWPlayer()];
}

export default JWPlayerInfo;
