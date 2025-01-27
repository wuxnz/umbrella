import Status from '../../../../core/shared/types/Status';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

export class LoadAllPluginsFromStorageUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(): Promise<Status<Plugin[]>> {
    return this.pluginRepository.loadAllPluginsFromStorage();
  }
}
