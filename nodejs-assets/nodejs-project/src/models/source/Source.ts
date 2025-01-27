import SourceType from './SourceType';

interface Source {
  sourceType: PluginType;
  author?: string;
  name: string;
  version: number;
  description?: string;
  homePageUrl?: string;
  iconUrl?: string;
  manifestPath?: string;
  manifestUrl?: string;
  pluginPath?: string;
  pluginUrl?: string;
}

export default Source;
