import Status from '../../../../core/shared/types/Status';
import Category from '../../data/model/item/Category';
import DetailedItem from '../../data/model/item/DetailedItem';
import ExtractorAudio from '../../data/model/media/ExtractorAudio';
import ExtractorVideo from '../../data/model/media/ExtractorVideo';
import RawAudio from '../../data/model/media/RawAudio';
import RawVideo from '../../data/model/media/RawVideo';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Run plugin method in sandbox usecase
// This is the usecase for running a plugin method in a sandbox
export class RunPluginMethodInSandbox {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<
    Status<
      | Category
      | Category[]
      | DetailedItem
      | (RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]
      | null
    >
  > {
    return await this.pluginRepository.runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );
  }
}
