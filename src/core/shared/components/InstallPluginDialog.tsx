import {useColorScheme, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Dialog, Portal, Snackbar, Text} from 'react-native-paper';
import {DarkTheme, LightTheme} from '../../theme/theme';
import {useInstallPluginDialogStore} from '../../../features/plugins/presentation/stores/useInstallPluginDialogStore';

// InstallPluginDialog
// This component is used to display a dialog that asks the user to install a plugin
// Shown on the Plugins screen (src/features/plugins/PluginNavigator.tsx)

function InstallPluginDialog() {
  const colorScheme = useColorScheme();
  const [waitingForPlugins, setWaitingForPlugins] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [loadingPlugins, setLoadingPlugins] = useState(false);

  const {deleteManifestFile, source, visible, setVisible, onConfirm} =
    useInstallPluginDialogStore(state => state);

  useEffect(() => {
    setWaitingForPlugins(true);
    setCancelLoading(false);
  }, [visible]);

  const cancel = () => {
    setCancelLoading(true);
    setWaitingForPlugins(false);
    deleteManifestFile();
    setVisible(false);
  };

  if (visible && waitingForPlugins) {
    return (
      <Snackbar
        visible={waitingForPlugins}
        onDismiss={() => {
          setWaitingForPlugins(false);
        }}
        action={{
          label: 'Cancel',
          onPress: () => cancel(),
        }}>
        Fetching plugin manifest...
      </Snackbar>
    );
  }

  if (cancelLoading) {
    return null;
  }

  if (loadingPlugins) {
    return (
      <Snackbar
        visible={loadingPlugins}
        onDismiss={() => {
          setLoadingPlugins(false);
        }}>
        Loading plugin...
      </Snackbar>
    );
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Icon icon="power-plug" />
        <Dialog.Title style={{textAlign: 'center'}}>
          Install {source.name}?
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">Author: {source.author}</Text>
          <Text variant="titleMedium">Version: {source.version}</Text>
          <Text variant="titleMedium">Description: {source.description}</Text>
          <View style={{height: 8}} />
          <Text variant="bodyMedium">
            Are you sure you want to install '{source.name}'? This will open '
            {source.homePageUrl}'.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              cancel();
            }}
            textColor={`${
              colorScheme === 'dark'
                ? DarkTheme.colors.disabled
                : LightTheme.colors.disabled
            }`}>
            Cancel
          </Button>
          <Button
            onPress={() => {
              setVisible(false);
              setLoadingPlugins(true);
              onConfirm().then(() => setLoadingPlugins(false));
            }}>
            Install
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default InstallPluginDialog;
