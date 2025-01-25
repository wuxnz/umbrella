import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {Plugin} from '../entities/Plugin';
import {PluginRepository} from '../repositories/PluginRepository';

// Fetch manifest usecase
// This is the usecase for fetching a manifest file
export class FetchManifestUsecase {
  constructor(private pluginRepository: PluginRepository) {}

  async execute(url: string): Promise<Status<Source>> {
    return this.pluginRepository.fetchManifest(url);
  }
}
