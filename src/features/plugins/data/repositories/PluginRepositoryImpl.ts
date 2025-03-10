import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {usePluginStore} from '../../presentation/state/usePluginStore';
import Category from '../model/item/Category';
import DetailedItem from '../model/item/DetailedItem';
import {PluginService} from '../datasource/PluginService';
import RawVideo from '../model/media/RawVideo';
import RawAudio from '../model/media/RawAudio';
import ExtractorVideo from '../model/media/ExtractorVideo';
import ExtractorAudio from '../model/media/ExtractorAudio';

// Plugin repository implementation
// This is the implementation of the plugin repository
// that uses the plugin service.
// Will be used by the plugin usecases in the viewmodels
export class PluginRepositoryImpl implements PluginRepository {
  async deletePlugin(manifest: Plugin): Promise<Status<void>> {
    return PluginService.deletePlugin(manifest);
  }

  async fetchManifest(manifestUrl: string): Promise<Status<Plugin>> {
    return PluginService.fetchManifest(manifestUrl);
  }

  async fetchPlugin(manifest: Plugin): Promise<Status<Plugin>> {
    return PluginService.fetchPlugin(manifest);
  }

  getPlugin(path: string): Plugin {
    const {getPlugin} = usePluginStore.getState();
    // this.plugins = plugins;
    const plugin = getPlugin(path);
    if (!plugin) {
      throw new Error('Plugin not found');
    }
    return plugin;
  }

  getPlugins(): Plugin[] {
    const {getPlugins} = usePluginStore.getState();
    // this.plugins = plugins;
    return getPlugins();
  }

  async loadAllPluginsFromStorage(): Promise<Status<Plugin[]>> {
    return PluginService.loadAllPluginsFromStorage();
  }

  async registerPlugin(plugin: Plugin): Promise<Status<void>> {
    const {registerPlugin: registerPluginState} = usePluginStore.getState();
    registerPluginState(plugin);
    return {status: 'success', data: undefined};
  }

  async runPluginMethodInSandbox(
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
  > {
    return PluginService.runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );
  }
}
