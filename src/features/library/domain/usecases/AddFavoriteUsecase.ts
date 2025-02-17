import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class AddFavoriteUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(item: Favorite): void {
    this.repository.addFavorite(item);
  }
}
