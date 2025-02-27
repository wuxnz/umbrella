import {Favorite} from '../../domain/entities/Favorite';
import {LibraryPageData} from '../../domain/entities/LibraryPageData';
import {LibraryRepository} from '../../domain/repository/LibraryRepository';
import {LibraryService} from '../datasource/LibraryService';

export class LibraryRepositoryImpl implements LibraryRepository {
  createFavoriteStore(profileId: string): void {
    LibraryService.createFavoriteStore(profileId);
  }
  loadProfile(profileId: string): void {
    LibraryService.loadProfile(profileId);
  }
  getFavoritesData(): LibraryPageData {
    return LibraryService.getFavoritesData();
  }
  getFavorites(): Favorite[] {
    return LibraryService.getFavoritesData().favorites;
  }
  addFavorite(favorite: Favorite): void {
    LibraryService.addFavorite(favorite);
  }
  removeFavorite(id: string): void {
    LibraryService.removeFavorite(id);
  }
  updateFavorite(id: string, item: Favorite): void {
    LibraryService.updateFavorite(id, item);
  }
  clearFavorites(): void {
    LibraryService.clearFavorites();
  }
}
