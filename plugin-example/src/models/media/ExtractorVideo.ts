import MediaType from './MediaType';

interface ExtractorVideo {
  type: MediaType.ExtractorVideo;
  url: string;
  name: string;
  iconUrl?: string;
  headers?: Record<string, string>;
}

export default ExtractorVideo;
