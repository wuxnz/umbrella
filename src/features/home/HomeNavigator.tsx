import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Appbar, TouchableRipple, Text} from 'react-native-paper';
import {useProfileStore} from '../profile/presentation/state/useProfileStore';
import {useNavigation} from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';

const HomeNavigator = () => {
  return (
    <View style={{flex: 1}}>
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
