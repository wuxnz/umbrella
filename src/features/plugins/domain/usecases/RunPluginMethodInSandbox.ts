import Status from '../../../../core/shared/types/Status';
import Category from '../../data/models/item/Category';
import DetailedItem from '../../data/models/item/DetailedItem';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

class RunPluginMethodInSandbox {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>> {
    return await this.pluginRepository.runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );
  }
}
