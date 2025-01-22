import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {Plugin} from '../../domain/entities/Plugin';
import {PluginRepository} from '../../domain/repositories/PluginRepository';
import {FetchManifestUsecase} from '../../domain/usecases/FetchManifestUsecase';
import {FetchPluginUsecase} from '../../domain/usecases/FetchPluginUsecase';

const fetchManifest = new FetchManifestUsecase(new PluginRepositoryImpl());
const fetchPlugin = new FetchPluginUsecase(new PluginRepositoryImpl());

export class PluginViewModel {
  async fetchManifest(url: string): Promise<Status<Source>> {
    return fetchManifest.execute(url);
  }

  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
    return fetchPlugin.execute(manifest);
  }
}
