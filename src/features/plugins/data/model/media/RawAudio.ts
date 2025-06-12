import MediaType from './MediaType';
import {Subtitle} from './Subtitle';

interface RawAudio {
  type: MediaType.RawAudio;
  url: string;
  name: string;
  iconUrl?: string;
  fileType?: string;
  headers?: Record<string, string>;
  subtitles?: Subtitle[];
}

export default RawAudio;
