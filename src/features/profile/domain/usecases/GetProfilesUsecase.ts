import {Profile} from '../entities/Profile';
import {ProfileRepository} from '../repository/ProfileRepository';

export class GetProfilesUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(): Profile[] {
    return this.profileRepository.getProfiles();
  }
}
