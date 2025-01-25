import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Fetch plugin usecase
// This is the usecase for fetching a plugin file
export class FetchPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(manifest: Source): Promise<Status<Plugin>> {
    return this.pluginRepository.fetchPlugin(manifest);
  }
}
