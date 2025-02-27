import {LibraryRepositoryImpl} from '../../data/repository/LibraryRepositoryImpl';
import {Favorite} from '../../domain/entities/Favorite';
import {LibraryPageData} from '../../domain/entities/LibraryPageData';
import {LibraryRepository} from '../../domain/repository/LibraryRepository';
import {AddFavoriteUsecase} from '../../domain/usecases/AddFavoriteUsecase';
import {ClearFavoritesUsecase} from '../../domain/usecases/ClearFavoritesUsecase';
import {CreateFavoriteStoreUsecase} from '../../domain/usecases/CreateFavoriteStore';
import {GetFavoritesDataUsecase} from '../../domain/usecases/GetFavoritesDataUsecase';
import {GetFavoritesUsecase} from '../../domain/usecases/GetFavoritesUsecase';
import {LoadProfileUsecase} from '../../domain/usecases/LoadProfileUsecase';
import {RemoveFavoriteUsecase} from '../../domain/usecases/RemoveFavoriteUsecase';
import {UpdateFavoriteUsecase} from '../../domain/usecases/UpdateFavoriteUsecase';

const createFavoriteStore = new CreateFavoriteStoreUsecase(
  new LibraryRepositoryImpl(),
);
const loadProfile = new LoadProfileUsecase(new LibraryRepositoryImpl());
const getFavoritesData = new GetFavoritesDataUsecase(
  new LibraryRepositoryImpl(),
);
const getFavorites = new GetFavoritesUsecase(new LibraryRepositoryImpl());
const addFavorite = new AddFavoriteUsecase(new LibraryRepositoryImpl());
const removeFavorite = new RemoveFavoriteUsecase(new LibraryRepositoryImpl());
const updateFavorite = new UpdateFavoriteUsecase(new LibraryRepositoryImpl());
const clearFavorites = new ClearFavoritesUsecase(new LibraryRepositoryImpl());

// Library View Model
// This is the view model that will be used to interact with the library repository.
// Will be used to create, update and delete favorites in the library.
// Will be used in other features.
export class LibraryViewModel implements LibraryRepository {
  createFavoriteStore(profileId: string): void {
    createFavoriteStore.execute(profileId);
  }

  loadProfile(profileId: string): void {
    loadProfile.exeute(profileId);
  }

  getFavoritesData(): LibraryPageData {
    return getFavoritesData.execute();
  }

  getFavorites(): Favorite[] {
    return getFavorites.execute();
  }

  addFavorite(item: Favorite): void {
    addFavorite.execute(item);
  }

  removeFavorite(id: string): void {
    removeFavorite.execute(id);
  }

  updateFavorite(id: string, item: Favorite): void {
    updateFavorite.execute(id, item);
  }

  clearFavorites(): void {
    clearFavorites.execute();
  }
}
