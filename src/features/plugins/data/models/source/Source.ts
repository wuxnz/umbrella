import SourceType from './SourceType';

interface Source {
  name: string;
  description: string;
  image: string;
  version: number;
  url: string;
  type: SourceType;
}

export default Source;
