import SourceType from './SourceType';

interface Source {
  sourceType: SourceType;
  author?: string;
  name: string;
  version: number;
  description?: string;
  homePageUrl?: string;
  iconUrl?: string;
  manifestFilePath?: string;
  manifestUrl?: string;
  pluginFilePath?: string;
  pluginUrl?: string;
}

export default Source;
