import MediaType from './MediaType';

interface ExtractorAudio {
  type: MediaType.ExtractorAudio;
  url: string;
  name: string;
  iconUrl?: string;
  headers?: Record<string, string>;
}

export default ExtractorAudio;
