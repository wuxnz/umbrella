import {PluginService} from '../../../plugins/data/datasource/PluginService';
import DetailedItem from '../../../plugins/data/models/item/DetailedItem';
import {Plugin} from '../../../plugins/domain/entities/Plugin';

export const DetailsService = {
  fetchDetails: async (id: string, plugin: Plugin): Promise<DetailedItem> => {
    const result = (await PluginService.runPluginMethodInSandbox(
      plugin.pluginPath!,
      'getItemDetails',
      [id],
    )) as DetailedItem;

    return result;
  },
};
