import {Favorite} from '../../domain/entities/Favorite';
import {useLibraryPageDataStore} from '../../presentation/state/useLibraryPageDataStore';

export const LibraryService = {
  createFavoriteStore(profileId: string) {
    const {favoriteProfiles, createFavoriteStore} =
      useLibraryPageDataStore.getState();
    const favoriteProfilesIds = favoriteProfiles.map(f => f.id);

    if (!favoriteProfilesIds.includes(profileId)) {
      return;
    } else {
      createFavoriteStore(profileId);
    }
  },
  loadProfile(profileId: string) {
    const {loadProfile} = useLibraryPageDataStore.getState();
    loadProfile(profileId);
  },
  getFavoritesData() {
    return useLibraryPageDataStore.getState().getFavoritesData();
  },
  getFavorites() {
    return useLibraryPageDataStore.getState().getFavorites();
  },
  addFavorite(favorite: Favorite) {
    return useLibraryPageDataStore.getState().addFavorite(favorite);
  },
  removeFavorite(id: string) {
    return useLibraryPageDataStore.getState().removeFavorite(id);
  },
  updateFavorite(id: string, favorite: Favorite) {
    return useLibraryPageDataStore.getState().updateFavorite(id, favorite);
  },
  clearFavorites() {
    return useLibraryPageDataStore.getState().clearFavorites();
  },
};
