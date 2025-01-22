import SourceType from './SourceType';

interface Source {
  sourceType: SourceType;
  author?: string;
  name: string;
  version: number;
  description?: string;
  homePageUrl?: string;
  iconUrl?: string;
  pluginFileUrl?: string;
}

export default Source;
