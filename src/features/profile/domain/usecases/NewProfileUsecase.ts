import {ProfileRepository} from '../repository/ProfileRepository';

export class LoadProfileUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(profileId: string): void {
    this.profileRepository.loadProfile(profileId);
  }
}
