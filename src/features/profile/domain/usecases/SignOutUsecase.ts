import {ProfileRepository} from '../repository/ProfileRepository';

export class SignOutUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(): void {
    this.profileRepository.signOut();
  }
}
