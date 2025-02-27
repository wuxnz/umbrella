import {LibraryPageData} from '../entities/LibraryPageData';
import {LibraryRepository} from '../repository/LibraryRepository';

export class GetFavoritesDataUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(): LibraryPageData {
    return this.repository.getFavoritesData();
  }
}
