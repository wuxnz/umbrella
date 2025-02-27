import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  DimensionValue,
} from 'react-native';
import React, {useEffect} from 'react';
import {Appbar, Icon, Text, useTheme} from 'react-native-paper';
import {Profile} from '../../domain/entities/Profile';
import {ProfileRepository} from '../../domain/repository/ProfileRepository';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgUri} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {LibraryViewModel} from '../../../library/presentation/viewmodels/LibraryViewModel';

type SelectProfileProps = {
  profiles: Profile[];
  profileViewModel: ProfileRepository;
  setShowCreateProfileScreen: (showCreateProfileScreen: boolean) => void;
};

const SelectProfile = ({
  profiles,
  profileViewModel,
  setShowCreateProfileScreen,
}: SelectProfileProps) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [landscape, setLandscape] = React.useState(false);

  const isLanddscape = () => {
    if (Dimensions.get('window').height < Dimensions.get('window').width) {
      setLandscape(true);
    } else {
      setLandscape(false);
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      isLanddscape();
    };

    Dimensions.addEventListener('change', updateDimensions);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Select Profile" />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView
          horizontal={landscape}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={styles.scrollView}>
          <View style={styles.profileList}>
            {profiles
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .map((profile: Profile) => (
                <TouchableOpacity
                  style={{
                    width: landscape ? '25%' : '40%',
                    aspectRatio: 1 / 1.35,
                  }}
                  onPress={() => {
                    profileViewModel.loadProfile(profile.id);
                    profileViewModel.updateProfile(profile.id, {
                      ...profile,
                      timestamp: Date.now(),
                    });
                    setShowCreateProfileScreen(false);
                    navigation.navigate('root' as never);
                  }}
                  key={profile.id}>
                  <View
                    style={{
                      width: '100%',
                      height: '80%',
                      overflow: 'hidden',
                      borderRadius: 12,
                      marginBottom: 8,
                    }}>
                    <SvgUri
                      width="100%"
                      height="100%"
                      uri={profile.profile_image}
                    />
                  </View>
                  <Text
                    variant="bodyLarge"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{textAlign: 'center'}}>
                    {profile.name}
                  </Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={{
                width: landscape ? '25%' : '40%',
                aspectRatio: 1 / 1.35,
              }}
              onPress={() => setShowCreateProfileScreen(true)}>
              <View style={styles.iconContainer}>
                <Icon
                  source="plus"
                  size={50}
                  color={theme.colors.onBackground}
                />
              </View>
              <Text
                variant="bodyLarge"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{textAlign: 'center'}}>
                Add Profile
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SelectProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {},
  profileList: {
    display: 'flex',
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 'auto',
    alignSelf: 'center',
  },
  profileImageContainer: {
    borderRadius: 8,
  },
  addProfileImageContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  iconContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#808080',
    borderRadius: 12,
    marginBottom: 8,
  },
});
