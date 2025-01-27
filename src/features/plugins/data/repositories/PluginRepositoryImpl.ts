import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {usePluginStore} from '../../presentation/stores/usePluginStore';
import Category from '../models/item/Category';
import DetailedItem from '../models/item/DetailedItem';
import {PluginService} from '../sources/PluginService';

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
    const {registerPlugin} = usePluginStore.getState();
    registerPlugin(plugin);
    // this.plugins = plugins;
    return {status: 'success', data: undefined};
  }

  async runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>> {
    return PluginService.runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );
  }
}
