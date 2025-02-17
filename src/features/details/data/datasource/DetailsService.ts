import Status from '../../../../core/shared/types/Status';
import {PluginService} from '../../../plugins/data/datasource/PluginService';
import DetailedItem from '../../../plugins/data/model/item/DetailedItem';
import RawAudio from '../../../plugins/data/model/media/RawAudio';
import RawVideo from '../../../plugins/data/model/media/RawVideo';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

export const DetailsService = {
  fetchDetails: async (
    id: string,
    plugin: Plugin,
  ): Promise<Status<DetailedItem>> => {
    const result = (await PluginService.runPluginMethodInSandbox(
      plugin.pluginPath!,
      'getItemDetails',
      [id],
    )) as Status<DetailedItem>;

    return result;
  },
  getItemMedia: async (
    id: string,
    plugin: Plugin,
  ): Promise<(RawAudio | RawVideo)[]> => {
    const result = (await PluginService.runPluginMethodInSandbox(
      plugin.pluginPath!,
      'getItemMedia',
      [id],
    )) as Status<(RawAudio | RawVideo)[]>;

    if (result.status === 'error') {
      throw new Error(result.error);
    }

    return result.data!;
  },
};
