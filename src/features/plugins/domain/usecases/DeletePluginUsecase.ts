import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {PluginRepository} from '../repositories/PluginRepository';

// Delete plugin usecase
// This is the usecase for deleting a plugin
export class DeletePluginUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(manifest: Source): Promise<Status<void>> {
    return this.pluginRepository.deletePlugin(manifest);
  }
}
