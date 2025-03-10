import Status from '../../../../core/shared/types/Status';
import Category from '../../data/model/item/Category';
import DetailedItem from '../../data/model/item/DetailedItem';
import ExtractorAudio from '../../data/model/media/ExtractorAudio';
import ExtractorVideo from '../../data/model/media/ExtractorVideo';
import RawAudio from '../../data/model/media/RawAudio';
import RawVideo from '../../data/model/media/RawVideo';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';
import {FetchManifestUsecase} from '../../domain/usecases/FetchManifestUsecase';
import {FetchPluginUsecase} from '../../domain/usecases/FetchPluginUsecase';
import {GetPluginUsecase} from '../../domain/usecases/GetPluginUsecase';
import {GetPluginsUsecase} from '../../domain/usecases/GetPluginsUsecase';
import {LoadAllPluginsFromStorageUsecase} from '../../domain/usecases/LoadAllPluginsFromStorage';
import {RegisterPluginUsecase} from '../../domain/usecases/RegisterPluginUsecase';
import {RunPluginMethodInSandbox} from '../../domain/usecases/RunPluginMethodInSandbox';

const fetchManifest = new FetchManifestUsecase(new PluginRepositoryImpl());
const deleteManifestFile = new DeletePluginUsecase(new PluginRepositoryImpl());
const fetchPlugin = new FetchPluginUsecase(new PluginRepositoryImpl());
const getPlugin = new GetPluginUsecase(new PluginRepositoryImpl());
const getPlugins = new GetPluginsUsecase(new PluginRepositoryImpl());
const loadAllPluginsFromStorage = new LoadAllPluginsFromStorageUsecase(
  new PluginRepositoryImpl(),
);
const registerPlugin = new RegisterPluginUsecase(new PluginRepositoryImpl());

// Plugin View Model
// This is the viewmodel for the plugin feature
// Will be used by the plugin view
// Triggers the plugin usecases
export class PluginViewModel implements PluginRepository {
  async fetchManifest(url: string): Promise<Status<Plugin>> {
    return fetchManifest.execute(url);
  }

  async deletePlugin(manifest: Plugin): Promise<Status<void>> {
    return deleteManifestFile.execute(manifest);
  }

  async fetchPlugin(manifest: Plugin): Promise<Status<Plugin>> {
    return fetchPlugin.execute(manifest);
  }

  getPlugin(pluginPath: string): Plugin {
    return getPlugin.execute(pluginPath);
  }

  getPlugins(): Plugin[] {
    return getPlugins.execute();
  }

  async loadAllPluginsFromStorage(): Promise<Status<Plugin[]>> {
    return loadAllPluginsFromStorage.execute();
  }

  async registerPlugin(plugin: Plugin): Promise<Status<void>> {
    return registerPlugin.execute(plugin);
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
    return await new RunPluginMethodInSandbox(
      new PluginRepositoryImpl(),
    ).execute(pluginPath, methodToRun, args);
  }
}
