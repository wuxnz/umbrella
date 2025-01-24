import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class RegisterPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(plugin: Plugin): Promise<Status<void>> {
    return await this.pluginRepository.registerPlugin(plugin);
  }
}
