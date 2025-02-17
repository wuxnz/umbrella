import {ProfileRepositoryImpl} from '../../data/repository/ProfileRepositoryImpl';
import {Profile} from '../../domain/entities/Profile';
import {ProfileRepository} from '../../domain/repository/ProfileRepository';
import {AddProfileUsecase} from '../../domain/usecases/AddProfileUsecase';
import {DeleteAllUsecase} from '../../domain/usecases/DeleteAllUsecase';
import {DeleteProfileUsecase} from '../../domain/usecases/DeleteProfileUsecase';
import {GetProfilesUsecase} from '../../domain/usecases/GetProfilesUsecase';
import {LoadProfileUsecase} from '../../domain/usecases/NewProfileUsecase';
import {SignOutUsecase} from '../../domain/usecases/SignOutUsecase';
import {UpdateProfileUsecase} from '../../domain/usecases/UpdateProfileUsecase';

const getProfiles = new GetProfilesUsecase(new ProfileRepositoryImpl());
const loadProfile = new LoadProfileUsecase(new ProfileRepositoryImpl());
const signOut = new SignOutUsecase(new ProfileRepositoryImpl());
const addProfile = new AddProfileUsecase(new ProfileRepositoryImpl());
const updateProfile = new UpdateProfileUsecase(new ProfileRepositoryImpl());
const deleteProfile = new DeleteProfileUsecase(new ProfileRepositoryImpl());
const deleteAll = new DeleteAllUsecase(new ProfileRepositoryImpl());

// Profile View Model
// This is the viewmodel for the profile page
// Will be used by the profile view to triggger
// actions on the store
export class ProfileViewModel implements ProfileRepository {
  getProfiles(): Profile[] {
    return getProfiles.execute();
  }

  loadProfile(profileId: string): void {
    loadProfile.execute(profileId);
  }

  signOut(): void {
    signOut.execute();
  }

  addProfile(profile: Profile): void {
    addProfile.execute(profile);
  }

  updateProfile(profileId: string, profile: Profile): void {
    updateProfile.execute(profileId, profile);
  }

  deleteProfile(profileId: string): void {
    deleteProfile.execute(profileId);
  }

  deleteAll(): void {
    deleteAll.execute();
  }
}
