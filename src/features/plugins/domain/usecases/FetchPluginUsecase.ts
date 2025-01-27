import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Fetch plugin usecase
// This is the usecase for fetching a plugin file
export class FetchPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(manifest: Plugin): Promise<Status<Plugin>> {
    return this.pluginRepository.fetchPlugin(manifest);
  }
}
