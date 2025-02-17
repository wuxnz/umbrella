import {Profile} from '../entities/Profile';

export interface ProfileRepository {
  getProfiles(): Profile[];
  loadProfile(profileId: string): void;
  signOut(): void;
  addProfile(profile: Profile): void;
  updateProfile(profileId: string, profile: Profile): void;
  deleteProfile(profileId: string): void;
  deleteAll(): void;
}
