import MediaType from './MediaType';

interface RawVideo {
  type: MediaType.RawVideo;
  url: string;
  name: string;
  iconUrl?: string;
  width?: number;
  height?: number;
  size?: number;
  fileType?: string;
  headers?: Record<string, string>;
}

export default RawVideo;
