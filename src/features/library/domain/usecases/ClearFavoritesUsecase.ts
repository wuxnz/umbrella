import {LibraryRepository} from '../repository/LibraryRepository';

export class ClearFavoritesUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(): void {
    this.repository.clearFavorites();
  }
}
