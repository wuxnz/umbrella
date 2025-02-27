import {LibraryRepository} from '../repository/LibraryRepository';

export class CreateFavoriteStoreUsecase {
  constructor(private readonly repository: LibraryRepository) {}

  execute(profileId: string): void {
    this.repository.createFavoriteStore(profileId);
  }
}
