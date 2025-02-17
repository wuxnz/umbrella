import MediaType from './MediaType';

interface RawAudio {
  type: MediaType.RawAudio;
  url: string;
  name: string;
  iconUrl?: string;
  fileType?: string;
  headers?: Record<string, string>;
}

export default RawAudio;
