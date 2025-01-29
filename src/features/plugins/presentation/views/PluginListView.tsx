import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  Linking,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {usePluginStore} from '../state/usePluginStore';
import constants from '../../../../core/utils/constants';
import {useInstallPluginDialogStore} from '../state/useInstallPluginDialogStore';
import {PluginViewModel} from '../viewmodels/PluginViewModel';
import {checkManagePermission} from 'manage-external-storage';
import GrantPermissionDialog from '../../../../core/shared/components/GrantPermissionDialog';
import {useGrantPermissionDialogStore} from '../state/useGrantPermissionDialogStore';
import InstallPluginDialog from '../../../../core/shared/components/InstallPluginDialog';
import PluginList from '../components/PluginList';
import ConfirmOrDenyDialog from '../../../../core/shared/components/ConfirmOrDenyDialog';
import {DarkTheme, LightTheme} from '../../../../core/theme/theme';
import {LoadAllPluginsFromStorageUsecase} from '../../domain/usecases/LoadAllPluginsFromStorage';

const PluginListView = () => {
  const {plugins, setPlugins} = usePluginStore(state => state);

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

  const {permissionsGranted, onPermissionsGranted} = usePluginStore(
    state => state,
  );

  const {
    setTitle,
    setReason,
    setOnConfirm: setGrantOnConfirm,
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
          setGrantOnConfirm(() => setGrantVisible(false));
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

  const {pluginToDelete} = usePluginStore(state => state);

  const pluginViewModel = new PluginViewModel();

  useEffect(() => {
    pluginViewModel.loadAllPluginsFromStorage().then(result => {
      if (result.status === 'success') {
        setPlugins(result.data!);
      }
    });
  }, [plugins]);

  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}>
      {plugins.length === 0 ? (
        <View style={styles.noPlugins}>
          <Text>Waiting for plugins to load</Text>
          <View style={{height: 8}} />
          <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
          <View style={{height: 16}} />
        </View>
      ) : (
        <View style={styles.pluginList}>
          <PluginList plugins={plugins} />
        </View>
      )}
    </View>
  );
};

export default PluginListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  noPlugins: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  pluginList: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
