import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
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

  const [showCreateProfileScreen, setShowCreateProfileScreen] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (profiles.length === 0) {
      setShowCreateProfileScreen(true);
    } else {
      setShowCreateProfileScreen(false);
    }
  }, [profiles]);

  return (
    <View style={{flex: 1}}>
      {showCreateProfileScreen ? (
        <CreateProfileView
          profileViewModel={profileViewModel}
          setShowCreateProfileScreen={setShowCreateProfileScreen}
        />
      ) : (
        <SelectProfile
          profiles={profiles}
          profileViewModel={profileViewModel}
          setShowCreateProfileScreen={setShowCreateProfileScreen}
        />
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
