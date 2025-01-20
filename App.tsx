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
import sleep from './src/core/utils/Sleep';

const supportedURL = 'umbrella://';

function InstallPluginDialog({
  visible,
  hideDialog,
  fetchPluginManifest,
  loadPlugin,
  plugin,
}: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPluginManifest = async () => {
      await sleep(5000).then(() => {
        console.log('fetching plugin manifest');
        // fetchPluginManifest();
        setLoading(false);
      });
    };

    if (!loading) {
      return;
    }
    fetchPluginManifest();
  }, []);

  console.log(loading);

  if (loading) {
    return (
      <Snackbar
        visible={visible && loading}
        onDismiss={() => setLoading(false)}
        action={{
          label: 'Cancel',
          onPress: () => {
            // Do something
          },
        }}>
        Fetching plugin manifest...
      </Snackbar>
    );
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon="power-plug" />
        <Dialog.Title style={{textAlign: 'center'}}>
          Install {plugin.name}?
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to install {plugin.name}?
          </Text>
          <Text variant="bodyMedium">This will open {plugin.homePageUrl}</Text>
          <Text variant="bodyMedium">{plugin.description}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
              setLoading(true);
            }}
            textColor="#fff">
            Cancel
          </Button>
          <Button
            onPress={() => {
              // Linking.openURL(plugin.homePageUrl);
              // hideDialog();
              console.log('installing');
              setLoading(true);
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
      if (url.startsWith(supportedURL)) {
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
