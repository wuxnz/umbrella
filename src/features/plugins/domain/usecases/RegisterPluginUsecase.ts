import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Register plugin usecase
// This is the usecase for registering a plugin
// Will be used by the plugin usecases in the viewmodels
// TODO: make sure this syncs with the plugin store
export class RegisterPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(plugin: Plugin): Promise<Status<void>> {
    return await this.pluginRepository.registerPlugin(plugin);
  }
}
