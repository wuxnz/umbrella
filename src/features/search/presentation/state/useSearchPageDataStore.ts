import {create} from 'zustand';
import SourceType from '../../../plugins/data/model/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import Category from '../../../plugins/data/model/item/Category';
import Item from '../../../plugins/data/model/item/Item';

// Search page data store
// This is used to store the search query and results.
// TODO: Test this with multiple plugins.

interface SearchPageDataStoreState {
  query: string;
  setQuery: (query: string) => void;
  pluginsToSearch: Plugin[];
  setPluginsToSearch: (pluginsToSearch: Plugin[]) => void;
  sourceTypesToSearch: SourceType[];
  setSourceTypesToSearch: (sourceTypesToSearch: SourceType[]) => void;
  results: Category[];
  setResults: (newResults: Category[]) => void;
  getResults: () => Category[];
  alreadyStarted: boolean;
  setAlreadyStarted: (alreadyStarted: boolean) => void;
  bottomSheetActivePlugin?: Plugin;
  setBottomSheetActivePlugin: (plugin: Plugin) => void;
  bottomSheetItems: Item[];
  setBottomSheetItems: (bottomSheetItems: Item[]) => void;
  bottomSheetVisible: boolean;
  setBottomSheetVisible: (bottomSheetVisible: boolean) => void;
}

export const useSearchPageDataStore = create<SearchPageDataStoreState>()(
  (set, get) => ({
    query: '',
    setQuery: (query: string) => set({query: query}),
    pluginsToSearch: [],
    setPluginsToSearch: (pluginsToSearch: Plugin[]) =>
      set({pluginsToSearch: pluginsToSearch}),
    sourceTypesToSearch: [],
    setSourceTypesToSearch: (sourceTypesToSearch: SourceType[]) =>
      set({sourceTypesToSearch: sourceTypesToSearch}),
    results: [],
    setResults: (newResults: Category[]) => set({results: newResults}),
    getResults: () => get().results,
    alreadyStarted: false,
    setAlreadyStarted: (newAlreadyStarted: boolean) => {
      set({alreadyStarted: newAlreadyStarted});
    },
    bottomSheetActivePlugin: undefined,
    setBottomSheetActivePlugin: (plugin: Plugin) =>
      set({bottomSheetActivePlugin: plugin}),
    bottomSheetItems: [],
    setBottomSheetItems: (bottomSheetItems: Item[]) =>
      set({bottomSheetItems: bottomSheetItems}),
    bottomSheetVisible: false,
    setBottomSheetVisible: (bottomSheetVisible: boolean) =>
      set({bottomSheetVisible: bottomSheetVisible}),
  }),
);
