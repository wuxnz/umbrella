import {PluginService} from '../../../plugins/data/datasource/PluginService';
import ContentService from '../../../plugins/data/model/ContentService';
import Category from '../../../plugins/data/model/item/Category';
import SourceType from '../../../plugins/data/model/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {usePluginStore} from '../../../plugins/presentation/state/usePluginStore';

import nodejs from 'nodejs-mobile-react-native';
import {useSearchPageDataStore} from '../../presentation/state/useSearchPageDataStore';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {AppRegistry} from 'react-native';
import uuid from 'react-native-uuid';

// Search service
// This is the service that gets the data for the search
// Will be used by the search repository implementation
// We use state here so we can display the data in the UI
// in a more reactive way
export const SearchService = {
  async initSearch(): Promise<void> {
    const {query, setResults, pluginsToSearch, getResults} =
      useSearchPageDataStore.getState();
    const SEARCH_TIMEOUT = 5000; // 5 seconds timeout for each search

    for (const plugin of pluginsToSearch) {
      if (!plugin.pluginPath) continue;

      try {
        // Function to fetch search results
        const searchPromise = PluginService.runPluginMethodInSandbox(
          plugin.pluginPath,
          'search',
          [query],
        ).then(res => res.data) as Promise<Category>;

        // Timeout Promise
        const timeoutPromise = new Promise<null>(resolve =>
          setTimeout(() => resolve(null), SEARCH_TIMEOUT),
        );

        // Run the search with timeout protection
        const category = await Promise.race([searchPromise, timeoutPromise]);

        if (category) {
          category.source = plugin;

          // Fetch the latest results
          const {results} = useSearchPageDataStore.getState();

          // Avoid duplicate categories by checking the source name
          if (!results.some(c => c.source?.name === plugin.name)) {
            setResults([...results, category]); // Directly update the state with the new array
          }
        } else {
          console.warn(`Search timed out for plugin: ${plugin.name}`);
        }
      } catch (error) {
        console.error(`Error searching with plugin ${plugin.name}:`, error);
      }
    }
  },
  async search(): Promise<Category[]> {
    const {
      getResults,
      setAlreadyStarted,
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

    setAlreadyStarted(true);
    await this.initSearch();

    const timeout = 15;
    var seconds = 0;
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const {results, alreadyStarted, pluginsToSearch, setAlreadyStarted} =
          useSearchPageDataStore.getState();
        if (
          (results.length === pluginsToSearch.length && alreadyStarted) ||
          seconds === timeout
        ) {
          clearInterval(interval);
          resolve(getResults());
          setAlreadyStarted(false);
        } else {
          seconds += 1;
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
