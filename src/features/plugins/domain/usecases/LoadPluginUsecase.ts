import Status from '../../../../core/shared/types/Status';
import {PluginRepository} from '../repositories/PluginRepository';

export class LoadPluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(path: string): Promise<Status<string>> {
    return await this.pluginRepository.loadPlugin(path);
  }
}
