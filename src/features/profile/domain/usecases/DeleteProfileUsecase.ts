import {ProfileRepository} from '../repository/ProfileRepository';

export class DeleteProfileUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(profileId: string): void {
    this.profileRepository.deleteProfile(profileId);
  }
}
