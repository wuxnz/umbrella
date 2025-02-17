import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  Appbar,
  Icon,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {ProfileViewModel} from './presentation/viewmodels/ProfileViewModel';
import {useProfileStore} from './presentation/state/useProfileStore';
import LazyImage from '../../core/shared/components/LazyImage';
import {useNavigation} from '@react-navigation/native';
import CreateProfileView from './presentation/views/CreateProfileView';
import {Profile} from './domain/entities/Profile';
import SelectProfile from './presentation/views/SelectProfile';

const ProfileNavigator = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const profileViewModel = new ProfileViewModel();
  const {profiles} = useProfileStore(state => state);

  return (
    <View style={{flex: 1}}>
      {profiles.length > 1 ? (
        <SelectProfile
          profiles={profiles}
          profileViewModel={profileViewModel}
        />
      ) : (
        <CreateProfileView profileViewModel={profileViewModel} />
      )}
    </View>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSelector: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
