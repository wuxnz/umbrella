import {BackHandler, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {Appbar, Button, TextInput, useTheme} from 'react-native-paper';
import {SvgUri} from 'react-native-svg';
import {Profile} from '../../domain/entities/Profile';
import uuid from 'react-native-uuid';
import {useProfileStore} from '../state/useProfileStore';
import {ProfileRepository} from '../../domain/repository/ProfileRepository';
import {useNavigation} from '@react-navigation/native';

type CreateProfileViewProps = {
  profileViewModel: ProfileRepository;
  setShowCreateProfileScreen: (showCreateProfileScreen: boolean) => void;
};

const CreateProfileView = ({
  profileViewModel,
  setShowCreateProfileScreen,
}: CreateProfileViewProps) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [name, setName] = React.useState('Name');
  const [profileImageUrl, setProfileImageUrl] = React.useState('');

  useEffect(() => {
    setProfileImageUrl(
      `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${name}`,
    );
  }, [name]);

  useEffect(() => {
    const backHandler = () => {
      setShowCreateProfileScreen(false);
      return true;
    };

    navigation.addListener('beforeRemove', backHandler);
    BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      navigation.removeListener('beforeRemove', backHandler);
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => setShowCreateProfileScreen(false)} />
        <Appbar.Content title="Create Profile" />
      </Appbar.Header>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <SvgUri uri={profileImageUrl} width={200} height={200} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            label="Name"
            mode="outlined"
            style={{paddingLeft: 8, marginVertical: 20}}
            outlineStyle={{borderRadius: 80}}
            underlineStyle={{display: 'none'}}
            onSubmitEditing={() => {}}
          />
          <Button
            icon={'account-plus'}
            mode="contained"
            textColor="white"
            style={{width: '35%', marginHorizontal: 'auto'}}
            onPress={() => {
              profileViewModel.addProfile({
                id: uuid.v4(),
                name: name,
                profile_image: profileImageUrl,
                timestamp: Date.now(),
              });
              setShowCreateProfileScreen(false);
            }}>
            Create
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CreateProfileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: 300,
    alignSelf: 'center',
  },
});
