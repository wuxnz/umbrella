import {PluginService} from '../../../plugins/data/datasource/PluginService';
import ContentService from '../../../plugins/data/model/ContentService';
import Category from '../../../plugins/data/model/item/Category';
import SourceType from '../../../plugins/data/model/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {usePluginStore} from '../../../plugins/presentation/state/usePluginStore';

import nodejs from 'nodejs-mobile-react-native';
import {useSearchPageDataStore} from '../../presentation/state/useSearchPageDataStore';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// Search service
// This is the service that gets the data for the search
// Will be used by the search repository implementation
// We use state here so we can display the data in the UI
// in a more reactive way
export const SearchService = {
  async initSearch(): Promise<void> {
    const {results, query, sourceTypesToSearch, setResults, pluginsToSearch} =
      useSearchPageDataStore.getState();

    for (const plugin of pluginsToSearch) {
      queueMicrotask(async () => {
        if (plugin.pluginPath === undefined) {
          return;
        }

        const category = (await PluginService.runPluginMethodInSandbox(
          plugin.pluginPath!,
          'search',
          [query],
        ).then(res => res.data)) as Category;

        category.source = plugin;

        setResults([...results, category]);
      });
    }
  },
  async search(): Promise<Category[]> {
    const {
      results,
      pluginsToSearch,
      getResults,
      alreadyStarted,
      setResults,
      setPluginsToSearch,
      sourceTypesToSearch,
    } = useSearchPageDataStore.getState();
    const plugins = usePluginStore.getState().plugins;
    setResults([]);

    if (
      sourceTypesToSearch?.length !== 0 &&
      sourceTypesToSearch !== undefined
    ) {
      setPluginsToSearch(
        plugins.filter(plugin =>
          sourceTypesToSearch?.includes(plugin.sourceType),
        ),
      );
    } else {
      setPluginsToSearch(plugins);
    }

    await this.initSearch();

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (results.length === pluginsToSearch.length && alreadyStarted) {
          clearInterval(interval);
          resolve(getResults());
        }
      }, 1000);
    });
  },
  async getNextPage(page: number, plugin: Plugin): Promise<void> {
    const {query, bottomSheetItems, setBottomSheetItems} =
      useSearchPageDataStore.getState();

    if (plugin.pluginPath === undefined) {
      return;
    }

    const category = (await PluginService.runPluginMethodInSandbox(
      plugin.pluginPath,
      'search',
      [query, page],
    ).then(res => res.data)) as Category;

    category.source = plugin;

    if (bottomSheetItems.every(item => item.id !== category.items[0].id)) {
      setBottomSheetItems([...bottomSheetItems, ...category.items]);
    }
  },
};
