import {ProfileRepository} from '../repository/ProfileRepository';

export class DeleteAllUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(): void {
    this.profileRepository.deleteAll();
  }
}
