import MediaType from './MediaType';

interface ExtractorAudio {
  type: MediaType.ExtractorAudio;
  url: string;
  name: string;
  iconUrl?: string;
}

export default ExtractorAudio;
