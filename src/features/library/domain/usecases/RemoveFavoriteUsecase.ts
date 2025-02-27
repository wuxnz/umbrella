import {Favorite} from '../entities/Favorite';
import {LibraryRepository} from '../repository/LibraryRepository';

export class RemoveFavoriteUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(id: string): void {
    this.repository.removeFavorite(id);
  }
}
