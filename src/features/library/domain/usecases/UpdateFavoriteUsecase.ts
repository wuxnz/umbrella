import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class UpdateFavoriteUsecase {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  execute(item: Favorite): void {
    this.libraryRepository.updateFavorite(item);
  }
}
