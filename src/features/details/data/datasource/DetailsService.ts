import Status from '../../../../core/shared/types/Status';
import {PluginService} from '../../../plugins/data/datasource/PluginService';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
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
};
