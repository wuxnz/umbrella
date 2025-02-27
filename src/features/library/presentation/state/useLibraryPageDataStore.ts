import {create} from 'zustand';
import {Favorite} from '../../domain/entities/Favorite';
import {LibraryPageData} from '../../domain/entities/LibraryPageData';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Library page data store
// This is where different profiles favorites are stored

interface LibraryPageDataStoreState {
  favoriteProfiles: LibraryPageData[];
  currentProfile: LibraryPageData;
  updateFavoriteProfiles: (currentProfile: LibraryPageData) => void;
  createFavoriteStore: (profileId: string) => void;
  loadProfile: (profileId: string) => void;
  getFavoritesData: () => LibraryPageData;
  getFavorites: () => Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  updateFavorite: (id: string, favorite: Favorite) => void;
  clearFavorites: () => void;
  categoriesToShow: string[];
  setCategoriesToShow: (categoriesToShow: string[]) => void;
}

export const useLibraryPageDataStore = create(
  persist<LibraryPageDataStoreState>(
    (set, get) => ({
      favoriteProfiles: [],
      currentProfile: {} as LibraryPageData,
      updateFavoriteProfiles(currentProfile) {
        set({
          favoriteProfiles: [
            ...get().favoriteProfiles.filter(p => p.id !== currentProfile.id),
            currentProfile,
          ],
        });
      },
      createFavoriteStore(profileId: string) {
        const profile = {id: profileId, favorites: []} as LibraryPageData;
        set({
          favoriteProfiles: [...get().favoriteProfiles, profile],
        });
        get().updateFavoriteProfiles(get().currentProfile);
      },
      loadProfile: (profileId: string) => {
        set({
          currentProfile: get().favoriteProfiles.find(p => p.id === profileId),
        });
        get().updateFavoriteProfiles(get().currentProfile);
      },
      getFavoritesData: () => {
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
        get().updateFavoriteProfiles(get().currentProfile);
      },
      removeFavorite: (id: string) => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: (get().currentProfile.favorites || []).filter(
              p => p.id !== id,
            ),
          },
        });
        get().updateFavoriteProfiles(get().currentProfile);
      },
      updateFavorite: (id: string, favorite: Favorite) => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: get().currentProfile.favorites?.map(f =>
              f.id === id ? favorite : f,
            ),
          },
        });
        get().updateFavoriteProfiles(get().currentProfile);
      },
      clearFavorites: () => {
        set({
          currentProfile: {
            ...get().currentProfile,
            favorites: [],
          },
        });
        get().updateFavoriteProfiles(get().currentProfile);
      },
      categoriesToShow: [],
      setCategoriesToShow(categoriesToShow) {
        set({categoriesToShow});
      },
    }),
    {
      name: 'libraryPageDataStore',
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
    },
  ),
);
