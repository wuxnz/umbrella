import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Get plugins usecase
// This is the usecase for getting the app's plugin classes
export class GetPluginsUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(): Plugin[] {
    return this.pluginRepository.getPlugins();
  }
}
