import Status from '../../../../core/shared/types/Status';
import Category from '../../data/model/item/Category';
import DetailedItem from '../../data/model/item/DetailedItem';
import ExtractorAudio from '../../data/model/media/ExtractorAudio';
import ExtractorVideo from '../../data/model/media/ExtractorVideo';
import RawAudio from '../../data/model/media/RawAudio';
import RawVideo from '../../data/model/media/RawVideo';
import {Plugin} from '../entities/Plugin';

// Plugin repository
// This is the interface for the plugin repository
// Describes the methods that the plugin repository must implement
export interface PluginRepository {
  // plugins: Plugin[];
  deletePlugin(manifest: Plugin): Promise<Status<void>>;
  fetchManifest(manifestUrl: string): Promise<Status<Plugin>>;
  fetchPlugin(manifest: Plugin): Promise<Status<Plugin>>;
  getPlugin(pluginPath: string): Plugin;
  getPlugins(): Plugin[];
  loadAllPluginsFromStorage(): Promise<Status<Plugin[]>>;
  registerPlugin(plugin: Plugin): Promise<Status<void>>;
  runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<
    Status<
      | Category
      | Category[]
      | DetailedItem
      | (RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]
      | null
    >
  >;
}
