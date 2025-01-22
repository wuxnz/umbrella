import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {PluginRepository} from '../repositories/PluginRepository';

export class DeleteManifestFileUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  execute(manifest: Source): Promise<Status<void>> {
    return this.pluginRepository.deleteManifestFile(manifest);
  }
}
