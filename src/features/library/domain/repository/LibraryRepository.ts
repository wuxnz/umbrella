import {Favorite} from '../entities/Favorite';
import {LibraryPageData} from '../entities/LibraryPageData';

export interface LibraryRepository {
  createFavoriteStore(profileId: string): void;
  loadProfile(profileId: string): void;
  getFavoritesData(): LibraryPageData;
  getFavorites(): Favorite[];
  addFavorite(item: Favorite): void;
  removeFavorite(id: string): void;
  updateFavorite(id: string, item: Favorite): void;
  clearFavorites(): void;
}
