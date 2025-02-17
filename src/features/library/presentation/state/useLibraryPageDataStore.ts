import {create} from 'zustand';
import {Favorite} from '../../domain/entities/Favorite';
import {LibrayPageData} from '../../domain/entities/LibraryPageData';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Library page data store
// This is where different profiles favorites are stored

interface LibraryPageDataStoreState {
  favoriteProfiles: LibrayPageData[];
  currentProfile: LibrayPageData;
  loadProfile: (profileId: string) => void;
  getData: () => LibrayPageData;
  getFavorites: () => Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (favorite: Favorite) => void;
  updateFavorite: (favorite: Favorite) => void;
  clearFavorites: () => void;
}

export const useLibraryPageDataStore = create(
  persist<LibraryPageDataStoreState>(
    (set, get) => ({
      favoriteProfiles: [],
      currentProfile: {} as LibrayPageData,
      loadProfile: (profileId: string) => {
        set({
          currentProfile: get().favoriteProfiles.find(p => p.id === profileId),
        });
      },
      getData: () => {
        return get().currentProfile;
      },
      getFavorites: () => {
        return get().currentProfile.favorites || [];
      },
      addFavorite: (favorite: Favorite) => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: [...(get().currentProfile.favorites || []), favorite],
          },
        });
      },
      removeFavorite: (favorite: Favorite) => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: (get().currentProfile.favorites || []).filter(
              p =>
                p.item.id !== favorite.item.id &&
                p.item.source !== favorite.item.source,
            ),
          },
        });
      },
      updateFavorite: (favorite: Favorite) => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: get().currentProfile.favorites?.map(f =>
              f.item.id === favorite.item.id ? favorite : f,
            ),
          },
        });
      },
      clearFavorites: () => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: [],
          },
        });
      },
    }),
    {
      name: 'libraryPageDataStore',
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
    },
  ),
);
