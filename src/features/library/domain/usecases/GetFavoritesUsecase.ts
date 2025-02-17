import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class GetFavoritesUsecase {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  execute(): Favorite[] {
    return this.libraryRepository.getFavorites();
  }
}
