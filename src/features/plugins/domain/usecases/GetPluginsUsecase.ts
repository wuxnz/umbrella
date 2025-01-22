import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class GetPluginsUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(): Plugin[] {
    return this.pluginRepository.getPlugins();
  }
}
