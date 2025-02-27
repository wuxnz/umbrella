import {useLibraryPageDataStore} from '../../../library/presentation/state/useLibraryPageDataStore';
import {LibraryViewModel} from '../../../library/presentation/viewmodels/LibraryViewModel';
import {Profile} from '../../domain/entities/Profile';
import {useProfileStore} from '../../presentation/state/useProfileStore';

export const ProfileService = {
  getProfiles(): Profile[] {
    const {getProfiles} = useProfileStore.getState();
    return getProfiles();
  },
  loadProfile(profileId: string): void {
    const {loadProfile} = useProfileStore.getState();
    const {
      favoriteProfiles,
      loadProfile: libraryLoadProfile,
      createFavoriteStore,
    } = useLibraryPageDataStore.getState();

    if (favoriteProfiles.map(p => p.id).includes(profileId)) {
      loadProfile(profileId);
      libraryLoadProfile(profileId);
    } else {
      createFavoriteStore(profileId);
      loadProfile(profileId);
      libraryLoadProfile(profileId);
    }
  },
  signOut(): void {
    const {signOut} = useProfileStore.getState();
    signOut();
  },
  addProfile(profile: Profile): void {
    const {addProfile} = useProfileStore.getState();
    addProfile(profile);
  },
  updateProfile(profileId: string, profile: Profile): void {
    const {updateProfile} = useProfileStore.getState();
    updateProfile(profileId, profile);
  },
  deleteProfile(profileId: string): void {
    const {deleteProfile} = useProfileStore.getState();
    deleteProfile(profileId);
  },
  deleteAll(): void {
    const {deleteAll} = useProfileStore.getState();
    deleteAll();
  },
};
