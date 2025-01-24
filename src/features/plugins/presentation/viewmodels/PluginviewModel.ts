import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {DeleteManifestFileUsecase} from '../../domain/usecases/DeleteManifestFileUsecase';
import {FetchManifestUsecase} from '../../domain/usecases/FetchManifestUsecase';
import {FetchPluginUsecase} from '../../domain/usecases/FetchPluginUsecase';
import {GetPluginsUsecase} from '../../domain/usecases/GetPluginsUsecase';
// import {LoadPluginUsecase} from '../../domain/usecases/LoadPluginUsecase';
import {RegisterPluginUsecase} from '../../domain/usecases/RegisterPluginUsecase';

const fetchManifest = new FetchManifestUsecase(new PluginRepositoryImpl());
const deleteManifestFile = new DeleteManifestFileUsecase(
  new PluginRepositoryImpl(),
);
const fetchPlugin = new FetchPluginUsecase(new PluginRepositoryImpl());
const getPlugins = new GetPluginsUsecase(new PluginRepositoryImpl());
// const loadPlugin = new LoadPluginUsecase(new PluginRepositoryImpl());
const registerPlugin = new RegisterPluginUsecase(new PluginRepositoryImpl());

export class PluginViewModel implements PluginRepository {
  plugins: Plugin[] = [];

  async fetchManifest(url: string): Promise<Status<Source>> {
    return fetchManifest.execute(url);
  }

  async deleteManifestFile(manifest: Source): Promise<Status<void>> {
    return deleteManifestFile.execute(manifest);
  }

  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
    return fetchPlugin.execute(manifest);
  }

  getPlugins(): Plugin[] {
    return getPlugins.execute();
  }

  // loadPlugin(path: string): Promise<Status<string>> {
  //   return loadPlugin.execute(path);
  // }

  async registerPlugin(plugin: Plugin): Promise<Status<void>> {
    return registerPlugin.execute(plugin);
  }
}
