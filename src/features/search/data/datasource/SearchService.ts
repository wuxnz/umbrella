import {PluginService} from '../../../plugins/data/datasource/PluginService';
import Category from '../../../plugins/data/model/item/Category';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import {usePluginStore} from '../../../plugins/presentation/state/usePluginStore';

import {useSearchPageDataStore} from '../../presentation/state/useSearchPageDataStore';

// Search service
// This is the service that gets the data for the search
// Will be used by the search repository implementation
// We use state here so we can display the data in the UI
// in a more reactive way
export const SearchService = {
  async _runPluginSearch(plugin: Plugin, query: string): Promise<void> {
    if (!plugin.pluginPath) {
      console.warn(`Skipping plugin ${plugin.name}: no pluginPath.`);
      return;
    }

    try {
      const category = (await PluginService.runPluginMethodInSandbox(
        plugin.pluginPath,
        'search',
        [query],
      ).then(res => res.data)) as Category;
      
      if (category) {
        category.source = plugin; // Attach the plugin as the source to the category

        useSearchPageDataStore.setState(state => {
          if (!state.results.some(c => c.source?.name === plugin.name)) {
            return {results: [...state.results, category]};
          }
          return {};
        });
      }
    } catch (error) {
      console.error(`Error searching with plugin ${plugin.name}:`, error);
    }
  },
  async search(): Promise<Category[]> {
    const {
      setResults,
      setPluginsToSearch,
      sourceTypesToSearch,
      query,
    } = useSearchPageDataStore.getState();
    const plugins = usePluginStore.getState().plugins;
    setResults([]);

    let pluginsToSearch: Plugin[];
    if (sourceTypesToSearch && sourceTypesToSearch.length > 0) {
      pluginsToSearch = plugins.filter(plugin =>
        sourceTypesToSearch.includes(plugin.sourceType),
      );
    } else {
      pluginsToSearch = plugins;
    }
    setPluginsToSearch(pluginsToSearch);

    // If no plugins are selected for search, return an empty array immediately
    if (pluginsToSearch.length === 0) {
      console.log('No plugins to search.');
      return [];
    }

    const searchPromises: Promise<void>[] = [];
    // Start all plugin searches concurrently without awaiting each one immediately
    for (const plugin of pluginsToSearch) {
      searchPromises.push(this._runPluginSearch(plugin, query));
    }

    // Wait for all initiated search promises to settle (resolve or reject).
    // This allows the `search()` function to return only when all background
    // search operations it launched are complete. The UI, however, updates
    // reactively via `_runPluginSearch`'s setState calls.
    await Promise.allSettled(searchPromises);

    // After all individual plugin searches have concluded, return the current state of results.
    return useSearchPageDataStore.getState().results;
  },
  async getNextPage(page: number, plugin: Plugin): Promise<void> {
    const {query} = useSearchPageDataStore.getState(); // Get the current query from the store

    if (plugin.pluginPath === undefined) {
      console.warn(
        `Cannot get next page for plugin ${plugin.name}: no pluginPath.`,
      );
      return;
    }

    try {
      const category = (await PluginService.runPluginMethodInSandbox(
        plugin.pluginPath,
        'search', // Assuming 'search' method also handles pagination via a second argument
        [query, page],
      ).then(res => res.data)) as Category;

      // Ensure a valid category and items are returned
      if (category && category.items && category.items.length > 0) {
        category.source = plugin; // Attach the source plugin

        // Use functional setState to safely append new items to bottomSheetItems
        useSearchPageDataStore.setState(state => {
          // Filter out any duplicate items if they already exist in bottomSheetItems
          const newItems = category.items.filter(newItem =>
            state.bottomSheetItems.every(
              existingItem => existingItem.id !== newItem.id,
            ),
          );
          return {
            bottomSheetItems: [...state.bottomSheetItems, ...newItems],
          };
        });
      } else {
        console.warn(
          `No new items or invalid category returned for plugin ${plugin.name}, page ${page}`,
        );
      }
    } catch (error) {
      console.error(
        `Error fetching next page for plugin ${plugin.name}:`,
        error,
      );
    }
  },
};
