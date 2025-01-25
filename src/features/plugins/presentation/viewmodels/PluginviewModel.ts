import Status from '../../../../core/shared/types/Status';
import Category from '../../data/models/item/Category';
import DetailedItem from '../../data/models/item/DetailedItem';
import Source from '../../data/models/source/Source';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';
import {FetchManifestUsecase} from '../../domain/usecases/FetchManifestUsecase';
import {FetchPluginUsecase} from '../../domain/usecases/FetchPluginUsecase';
import {GetPluginsUsecase} from '../../domain/usecases/GetPluginsUsecase';
import {RegisterPluginUsecase} from '../../domain/usecases/RegisterPluginUsecase';
import {RunPluginMethodInSandbox} from '../../domain/usecases/RunPluginMethodInSandbox';

const fetchManifest = new FetchManifestUsecase(new PluginRepositoryImpl());
const deleteManifestFile = new DeletePluginUsecase(new PluginRepositoryImpl());
const fetchPlugin = new FetchPluginUsecase(new PluginRepositoryImpl());
const getPlugins = new GetPluginsUsecase(new PluginRepositoryImpl());
const registerPlugin = new RegisterPluginUsecase(new PluginRepositoryImpl());

// Plugin viewmodel
// This is the viewmodel for the plugin feature
// Will be used by the plugin view
// Triggers the plugin usecases
export class PluginViewModel implements PluginRepository {
  plugins: Plugin[] = [];

  async fetchManifest(url: string): Promise<Status<Source>> {
    return fetchManifest.execute(url);
  }

  async deletePlugin(manifest: Source): Promise<Status<void>> {
    return deleteManifestFile.execute(manifest);
  }

  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
    return fetchPlugin.execute(manifest);
  }

  getPlugins(): Plugin[] {
    return getPlugins.execute();
  }

  async registerPlugin(plugin: Plugin): Promise<Status<void>> {
    return registerPlugin.execute(plugin);
  }

  async runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>> {
    return await new RunPluginMethodInSandbox(
      new PluginRepositoryImpl(),
    ).execute(pluginPath, methodToRun, args);
  }
}
