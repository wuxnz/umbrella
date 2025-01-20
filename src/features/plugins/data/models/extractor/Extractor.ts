import RawVideo from '../media/RawVideo';

interface Extractor {
  id: string;
  name: string;
  description: string;
  version: number;
  urlPatterns: RegExp[];
  extract(url: string): Promise<RawVideo[]>;
}
