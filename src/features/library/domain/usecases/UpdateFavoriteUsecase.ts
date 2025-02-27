import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class UpdateFavoriteUsecase {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  execute(id: string, item: Favorite): void {
    this.libraryRepository.updateFavorite(id, item);
  }
}
