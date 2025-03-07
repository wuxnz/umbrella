import ExtractorAudio from '../../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../../features/plugins/data/model/media/ExtractorVideo';
import MediaType from '../../../../../../features/plugins/data/model/media/MediaType';
import RawAudio from '../../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../../features/plugins/data/model/media/RawVideo';
import {Extractor} from '../../../domain/entities/Extractor';
import {ExtractorInfo} from '../../../domain/entities/ExtractorInfo';

class VidHideExtractor implements Extractor {
  name: string = 'VidHide';
  async execute(
    data: ExtractorVideo | ExtractorAudio,
  ): Promise<RawVideo[] | RawAudio[]> {
    try {
      const response = await fetch(data.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
          Referer: data.url,
        },
      })
        .then(response => response)
        .then(data => data.text());
      if (!response) {
        return [];
      }
      const scriptRegex = /eval([\s\S]*?)<\/script>/;
      const script = response.match(scriptRegex)![1];
      const urlSchemeRegex = /http./;
      var urlScheme = script.match(urlSchemeRegex)![0];
      if (urlScheme.endsWith('|')) {
        urlScheme = urlScheme.slice(0, -1);
      }
      const sAndFRegex = /data\|.*?([0-9]+)\|([0-9]+)/;
      const s = script.match(sAndFRegex)![1];
      const f = script.match(sAndFRegex)![2];
      const srvRegex = /file\|+[0-9]*\|(.*?)\|/;
      const srv = script.match(srvRegex)![1];
      const iRegex = /i=([0-9\.]*)&/;
      const i = script.match(iRegex)![1];
      const asnRegex = /text\|+([0-9]*)\|/;
      const asn = script.match(asnRegex)![1];
      const domainEndRegex = /[0-9]+\|[0-9]+\|[0-9]+\|[a-z]+\|(.*?)\|/;
      const domainEnd = script.match(domainEndRegex)![1];
      const infoChunkStart = script.split('|width|')[1];
      const infoChunkEnd = infoChunkStart.split('|sources|')[0];
      const infoChunkSplit = infoChunkEnd.split('|').reverse();
      const infoChunkOffset = infoChunkSplit[2] === 'hls2' ? 0 : 1;
      const m3u8Index = infoChunkSplit.indexOf('m3u8');
      const origin = `${urlScheme}://${infoChunkSplit[0]}.${infoChunkSplit[1]}${
        infoChunkOffset === 0 ? '' : '-' + infoChunkSplit[2]
      }.${domainEnd}/${infoChunkSplit[infoChunkOffset + 2]}`;
      var urlset = '/';
      if (origin.includes('urlset')) {
        urlset = ',l,n,h,.urlset/';
      }
      const tAndERegex = /srv\|([0-9]+)\|([\s\S]*?)\|m3u8/;
      const tAndE = script.match(tAndERegex)!;
      const t = tAndE[2].split('|').reverse().join('-');
      const e = tAndE[1];
      const videoUrl = `${origin}/${infoChunkSplit[infoChunkOffset + 3]}/${
        infoChunkSplit[infoChunkOffset + 4]
      }/${
        infoChunkSplit[infoChunkOffset + 5]
      }${urlset}master.m3u8?t=${t}&s=${s}&e=${e}&f=${f}&srv=${srv}&i=${i}&sp=${
        infoChunkSplit[infoChunkSplit.indexOf('sp') + 1]
      }&p1=${srv}&p2=${srv}&asn=${asn}`;
      return [
        {
          url: videoUrl,
          name: this.name,
          iconUrl: data.iconUrl,
          headers: data.headers,
        },
      ] as RawVideo[];
    } catch (error) {
      return [];
    }
  }
}

class VidHideExtractorInfo implements ExtractorInfo {
  id: string = 'vid-hide';
  patterns: RegExp[] = [/alions\.pro/];
  extractorMediaType: MediaType = MediaType.ExtractorVideo;
  extractors: Extractor[] = [new VidHideExtractor()];
}

export default VidHideExtractorInfo;
