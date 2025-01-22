import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import sleep from '../../utils/sleep';
import {Button, Dialog, Portal, Snackbar, Text} from 'react-native-paper';
import {DarkTheme, LightTheme} from '../../theme/theme';

function InstallPluginDialog({
  colorScheme,
  fetchPluginManifest,
  hideDialog,
  loadPlugin,
  source,
  visible,
}: any) {
  const [waitingForPlugins, setWaitingForPlugins] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [loadingPlugins, setLoadingPlugins] = useState(false);

  useEffect(() => {
    setWaitingForPlugins(true);
    setCancelLoading(false);

    if (!visible) {
      return;
    }

    sleep(5000).then(() => {
      fetchPluginManifest();
    });
  }, [visible]);

  if (visible && waitingForPlugins) {
    return (
      <Snackbar
        visible={waitingForPlugins}
        onDismiss={() => {
          setWaitingForPlugins(false);
        }}
        action={{
          label: 'Cancel',
          onPress: () => {
            setCancelLoading(true);
            setWaitingForPlugins(false);
            hideDialog();
          },
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
      <Dialog visible={visible} onDismiss={hideDialog}>
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
              hideDialog();
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
              hideDialog();
              setLoadingPlugins(true);
              loadPlugin();
            }}>
            Install
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default InstallPluginDialog;
