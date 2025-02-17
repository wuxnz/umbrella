// Profile store
// Where all the user profile identification data is stored
// Allows users to switch beetween different profiles
// and do basic CURD operations on their profiles

import {create} from 'zustand';
import {Profile} from '../../domain/entities/Profile';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PluginStoreState {
  profiles: Profile[];
  activeProfile?: Profile;
  getProfiles: () => Profile[];
  loadProfile: (profileId: string) => void;
  signOut: () => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (profileId: string, profile: Profile) => void;
  deleteProfile: (profileId: string) => void;
  deleteAll: () => void;
}

export const useProfileStore = create(
  persist<PluginStoreState>(
    (set, get) => ({
      profiles: [],
      activeProfile: undefined,
      getProfiles: () => get().profiles,
      loadProfile: (profileId: string) => {
        const profile = get().profiles.find(p => p.id === profileId);
        if (!profile) return;
        set({activeProfile: profile});
      },
      signOut: () => {
        set({profiles: [], activeProfile: undefined});
      },
      addProfile: (profile: Profile) => {
        set({profiles: [...get().profiles, profile]});
      },
      updateProfile: (profileId: string, profile: Profile) => {
        set({
          profiles: get().profiles.map(p =>
            p.id === profileId ? {...p, ...profile} : p,
          ),
        });
      },
      deleteProfile: (profileId: string) => {
        set({
          profiles: get().profiles.filter(p => p.id !== profileId),
        });
        if (get().activeProfile?.id === profileId) {
          set({activeProfile: undefined});
        }
      },
      deleteAll: () => {
        set({profiles: []});
      },
    }),
    {
      name: 'profileStore',
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
    },
  ),
);
