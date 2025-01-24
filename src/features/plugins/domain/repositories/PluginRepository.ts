import Status from '../../../../core/shared/types/Status';
import Source from '../../data/models/source/Source';
import {Plugin} from '../entities/Plugin';

export interface PluginRepository {
  plugins: Plugin[];
  fetchManifest(manifestUrl: string): Promise<Status<Source>>;
  deleteManifestFile(manifest: Source): Promise<Status<void>>;
  fetchPlugin(manifest: Source): Promise<Status<Plugin>>;
  getPlugins(): Plugin[];
  registerPlugin(plugin: Plugin): Promise<Status<void>>;
}
