import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class RegisterPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(plugin: Plugin): void {
    this.pluginRepository.registerPlugin(plugin);
  }
}
