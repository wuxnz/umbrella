import {Favorite} from '../entities/Favorite';
import {LibrayPageData} from '../entities/LibraryPageData';

export interface LibraryRepository {
  data: LibrayPageData;
  loadProfile(profileId: string): void;
  getData(): LibrayPageData;
  getFavorites(): Favorite[];
  addFavorite(item: Favorite): void;
  removeFavorite(item: Favorite): void;
  updateFavorite(item: Favorite): void;
  clearFavorites(): void;
}
