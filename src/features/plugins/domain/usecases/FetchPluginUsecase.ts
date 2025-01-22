import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class FetchPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(manifest: Source): Promise<Status<Plugin>> {
    return this.pluginRepository.fetchPlugin(manifest);
  }
}
