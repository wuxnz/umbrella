import {Profile} from '../../domain/entities/Profile';
import {ProfileRepository} from '../../domain/repository/ProfileRepository';
import {ProfileService} from '../datasource/ProfileService';

export class ProfileRepositoryImpl implements ProfileRepository {
  getProfiles(): Profile[] {
    return ProfileService.getProfiles();
  }

  loadProfile(profileId: string): void {
    ProfileService.loadProfile(profileId);
  }

  signOut(): void {
    ProfileService.signOut();
  }

  addProfile(profile: Profile): void {
    ProfileService.addProfile(profile);
  }

  updateProfile(profileId: string, profile: Profile): void {
    ProfileService.updateProfile(profileId, profile);
  }

  deleteProfile(profileId: string): void {
    ProfileService.deleteProfile(profileId);
  }

  deleteAll(): void {
    ProfileService.deleteAll();
  }
}
