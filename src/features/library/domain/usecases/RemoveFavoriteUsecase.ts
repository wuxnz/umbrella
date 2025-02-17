import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class RemoveFavoriteUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(item: Favorite): void {
    this.repository.removeFavorite(item);
  }
}
