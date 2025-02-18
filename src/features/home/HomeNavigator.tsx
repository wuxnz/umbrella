import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Appbar, TouchableRipple} from 'react-native-paper';
import {useProfileStore} from '../profile/presentation/state/useProfileStore';
import {useNavigation} from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';

const HomeNavigator = () => {
  const navigation = useNavigation();

  const {activeProfile} = useProfileStore(state => state);

  useEffect(() => {
    if (!activeProfile) {
      navigation.navigate('profile' as never);
    }
  }, [navigation, activeProfile]);

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <TouchableRipple>
          <SvgUri
            width={32}
            height={32}
            uri={activeProfile?.profile_image || ''}
            style={{marginRight: 16}}
            onPress={() => navigation.navigate('profile' as never)}
          />
        </TouchableRipple>
      </Appbar.Header>
      <View style={styles.container}>
        <Text>HomeNavigator</Text>
      </View>
    </View>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
