import {View, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {Appbar, Card, Text, TouchableRipple} from 'react-native-paper';
import {Profile} from '../../domain/entities/Profile';
import {useProfileStore} from '../state/useProfileStore';
import {ProfileRepository} from '../../domain/repository/ProfileRepository';
import {ScrollView} from 'react-native-gesture-handler';
import {SvgUri} from 'react-native-svg';

type SelectProfileProps = {
  profiles: Profile[];
  profileViewModel: ProfileRepository;
};

const SelectProfile = ({profiles, profileViewModel}: SelectProfileProps) => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Select Profile" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.profileList}>
          {profiles.map((profile: Profile) => (
            <TouchableRipple
              style={styles.profileItem}
              onPress={() => profileViewModel.loadProfile(profile.id)}>
              <Card>
                <Card.Content
                  style={{display: 'flex', flexDirection: 'column'}}>
                  <SvgUri
                    width="100%"
                    height="80%"
                    uri={profile.profile_image}
                  />
                  <Card.Title
                    titleVariant="titleLarge"
                    title={profile.name}
                    titleStyle={{textAlign: 'center'}}
                  />
                </Card.Content>
              </Card>
            </TouchableRipple>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SelectProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 20,
  },
  profileItem: {
    width: '46%',
    height: Dimensions.get('window').width / 1.75,
  },
});
