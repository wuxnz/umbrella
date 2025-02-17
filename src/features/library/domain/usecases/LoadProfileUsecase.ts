import {LibraryRepository} from '../repository/LibraryRepository';

export class LoadProfileUsecase {
  constructor(private readonly libraryRepository: LibraryRepository) {}

  exeute(profileId: string): void {
    this.libraryRepository.loadProfile(profileId);
  }
}
