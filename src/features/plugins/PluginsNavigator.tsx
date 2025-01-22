import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {usePluginStore} from './presentation/stores/usePluginStore';
import constants from '../../core/utils/constants';
import {Plugin} from './domain/entities/Plugin';
import InstallPluginDialog from '../../core/shared/components/InstallPluginDialog';
import {useDialogStore} from './presentation/stores/useDialogStore';
import {PluginViewModel} from './presentation/viewmodels/PluginViewModel';

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

  const {permissionsGranted, onPermissionsGranted, onPermissionsDenied} =
    usePluginStore();

  useEffect(() => {
    const requestPermission = async () => {
      // Permissions to request:
      // android.permission.READ_EXTERNAL_STORAGE
      // android.permission.WRITE_EXTERNAL_STORAGE

      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ])
          .then(() => {
            if (PermissionsAndroid.RESULTS.GRANTED) {
              onPermissionsGranted();
            } else {
              onPermissionsDenied();
            }
          })
          .catch(err => {
            console.warn(err);
          });
      } catch (err) {
        console.warn(err);
      }
    };

    if (
      Platform.OS === 'android' &&
      isVisible &&
      !requested &&
      !permissionsGranted
    ) {
      requestPermission().then(() => {
        setRequested(true);
      });
    }
  }, [isVisible]);

  const {setVisible, setSource} = useDialogStore(state => state);
  const pluginViewModel = new PluginViewModel();

  useEffect(() => {
    Linking.addEventListener('url', async ({url}) => {
      if (url.startsWith(constants.PLUGIN_SCHEME)) {
        const manifestUrl = url.replace(constants.PLUGIN_SCHEME, '');

        await pluginViewModel.fetchManifest(manifestUrl).then(result => {
          switch (result.status) {
            case 'success': {
              setSource(result.data);
              break;
            }
            case 'error': {
              console.error(result.error);
              break;
            }
            default:
              break;
          }
        });
        setVisible(true);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Waiting for plugins to load</Text>
      <View style={{height: 8}} />
      <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
      <View style={{height: 16}} />
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
