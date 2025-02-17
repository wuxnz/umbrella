import {Profile} from '../entities/Profile';
import {ProfileRepository} from '../repository/ProfileRepository';

export class AddProfileUsecase {
  constructor(private profileRepository: ProfileRepository) {}

  execute(profile: Profile): void {
    this.profileRepository.addProfile(profile);
  }
}
