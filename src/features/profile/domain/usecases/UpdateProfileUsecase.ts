import {Profile} from '../entities/Profile';
import {ProfileRepository} from '../repository/ProfileRepository';

export class UpdateProfileUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(profileId: string, profile: Profile): void {
    this.profileRepository.updateProfile(profileId, profile);
  }
}
