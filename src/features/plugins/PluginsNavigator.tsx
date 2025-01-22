import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper';

const PluginsNavigator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [requested, setRequested] = useState(false);

  useFocusEffect(() => {
    let appStateSubscription;

    const checkVisibility = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    appStateSubscription = AppState.addEventListener('change', checkVisibility);

    checkVisibility(AppState.currentState);

    return () => {
      appStateSubscription.remove();
    };
  });

  useEffect(() => {
    const requestPermission = async () => {
      // Permissions to request:
      // android.permission.READ_EXTERNAL_STORAGE
      // android.permission.WRITE_EXTERNAL_STORAGE
      console.log('running');
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ])
          .then(() => {
            console.log('Permissions granted');
          })
          .catch(err => {
            console.warn(err);
          });
        setRequested(true);
      } catch (err) {
        console.warn(err);
      }
      console.log('done');
    };

    if (Platform.OS === 'android' && isVisible && !requested) {
      requestPermission();
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Text>Waiting for plugins to load</Text>
      <View style={{height: 8}} />
      <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
      <View style={{height: 16}} />
      {/* <Button mode="contained" onPress={requestPermission}>
        Request permissions
      </Button> */}
    </View>
  );
};

export default PluginsNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
