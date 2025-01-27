import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class GetPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}
  execute(pluginPath: string): Plugin {
    return this.pluginRepository.getPlugin(pluginPath);
  }
}
