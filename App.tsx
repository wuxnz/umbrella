import {
  useColorScheme,
  StyleSheet,
  View,
  StatusBar,
  Linking,
} from 'react-native';
import {Button, PaperProvider, Snackbar} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect, useState} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {Dialog, Portal, Text} from 'react-native-paper';
import {Plugin} from './src/features/plugins/domain/entities/Plugin';
import sleep from './src/core/utils/sleep';

const supportedURL = 'umbrella://';

function InstallPluginDialog({
  visible,
  hideDialog,
  fetchPluginManifest,
  loadPlugin,
  colorScheme,
  plugin,
}: any) {
  const [waitingForPlugins, setWaitingForPlugins] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // useEffect(() => {
  //   setCancelLoading(false);
  // }, [visible]);

  useEffect(() => {
    setWaitingForPlugins(true);
    setCancelLoading(false);
    const fetchPluginManifest = async () => {
      console.log('fetching plugin manifest');
      await sleep(5000).then(() => {
        // fetchPluginManifest();
        // setWaitingForPlugins(false);
        // setCancelLoading(false);
      });
    };

    if (!visible) {
      return;
    }
    fetchPluginManifest();
  }, [visible]);

  console.log('waitingForPlugins', waitingForPlugins);
  console.log('cancelLoading', cancelLoading);
  console.log('visible', visible);

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
            // Do something
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

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon="power-plug" />
        <Dialog.Title style={{textAlign: 'center'}}>
          Install {plugin.name}?
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="titleMedium">Author: {plugin.author}</Text>
          <Text variant="titleMedium">Version: {plugin.version}</Text>
          <Text variant="titleMedium">Description: {plugin.description}</Text>
          <View style={{height: 8}} />
          <Text variant="bodyMedium">
            Are you sure you want to install '{plugin.name}'? This will open '
            {plugin.homePageUrl}'.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              // setWaitingForPlugins(true);
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
              // Linking.openURL(plugin.homePageUrl);
              hideDialog();
              console.log('installing');
              // setWaitingForPlugins(true);
            }}>
            Install
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const [visible, setVisible] = useState<boolean>(false);
  const [plugin, setPlugin] = useState<Plugin>({} as Plugin);

  const hideDialog = () => {
    setVisible(false);
  };

  useEffect(() => {
    Linking.addEventListener('url', ({url}) => {
      console.log(url);
      // console.log('supportedURL', supportedURL);
      // console.log(url.startsWith(supportedURL));
      if (url.startsWith(supportedURL)) {
        console.log('here');
        console.log(getBaseUrlFromString(url.replace(supportedURL, '')));
        setPlugin({
          author: 'invader',
          version: 1,
          name: 'Example Plugin',
          description: 'This is an example plugin',
          homePageUrl: url.replace(supportedURL, 'http://'),
        } as Plugin);
        setVisible(true);
      }
    });
  }, []);

  return (
    <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <View
          style={{
            ...styles.container,
            backgroundColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.background
                : LightTheme.colors.background,
          }}>
          <BottomNavigationBar />
        </View>
        <InstallPluginDialog
          visible={visible}
          hideDialog={hideDialog}
          fetchPluginManifest={() => {}}
          colorScheme={colorScheme}
          loadPlugin={() => {}}
          plugin={plugin}
        />
        <StatusBar
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
