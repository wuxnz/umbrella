import {Profile} from '../../domain/entities/Profile';
import {useProfileStore} from '../../presentation/state/useProfileStore';

export const ProfileService = {
  getProfiles(): Profile[] {
    const {getProfiles} = useProfileStore.getState();
    return getProfiles();
  },
  loadProfile(profileId: string): void {
    const {loadProfile} = useProfileStore.getState();
    loadProfile(profileId);
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
