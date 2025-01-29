import {create} from 'zustand';
import SourceType from '../../../plugins/data/models/source/SourceType';
import {Plugin} from '../../../plugins/domain/entities/Plugin';
import Category from '../../../plugins/data/models/item/Category';

interface SearchPageDataStoreState {
  query: string;
  setQuery: (query: string) => void;
  pluginsToSearch: Plugin[];
  setPluginsToSearch: (pluginsToSearch: Plugin[]) => void;
  sourceTypesToSearch: SourceType[];
  setSourceTypesToSearch: (sourceTypesToSearch: SourceType[]) => void;
  results: Category[];
  setResults: (results: Category[]) => void;
  getResults: () => Category[];
  alreadyStarted: boolean;
  setAlreadyStarted: (alreadyStarted: boolean) => void;
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
    setAlreadyStarted: (alreadyStarted: boolean) =>
      set({alreadyStarted: alreadyStarted}),
  }),
);
