import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {AppState, Linking, Platform, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {usePluginStore} from './presentation/stores/usePluginStore';
import constants from '../../core/utils/constants';
import {useInstallPluginDialogStore} from './presentation/stores/useInstallPluginDialogStore';
import {PluginViewModel} from './presentation/viewmodels/PluginViewModel';
import {
  checkManagePermission,
  requestManagePermission,
} from 'manage-external-storage';
import GrantPermissionDialog from '../../core/shared/components/GrantPermissionDialog';
import {useGrantPermissionDialogStore} from './presentation/stores/useGrantPermissionDialogStore';

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

  const {permissionsGranted, onPermissionsGranted} = usePluginStore();

  const {
    setTitle,
    setReason,
    setOnConfirm,
    setVisible: setGrantVisible,
  } = useGrantPermissionDialogStore(state => state);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const granted = await checkManagePermission();
        if (granted) {
          onPermissionsGranted();
        } else {
          setTitle('Manage External Storage');
          setReason(
            'To install plugins and save data from this app to your device.',
          );
          setOnConfirm(() => setGrantVisible(false));
          setGrantVisible(true);
        }
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

  const {
    setVisible: setInstallVisible,
    setSource,
    loading,
    setLoading,
  } = useInstallPluginDialogStore(state => state);
  const pluginViewModel = new PluginViewModel();

  useEffect(() => {
    Linking.addEventListener('url', async ({url}) => {
      if (loading) {
        return;
      }
      if (url.startsWith(constants.PLUGIN_SCHEME)) {
        setLoading(true);

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
        setInstallVisible(true);
        setLoading(false);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Waiting for plugins to load</Text>
      <View style={{height: 8}} />
      <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
      <View style={{height: 16}} />
      <GrantPermissionDialog />
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
