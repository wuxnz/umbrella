import './gesture-handler';
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
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InstallPluginDialog from './src/core/shared/components/InstallPluginDialog';

const supportedURL = 'umbrella://';

const Stack = createNativeStackNavigator();

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
      if (url.startsWith(supportedURL)) {
        setPlugin({
          author: 'invader',
          version: 1,
          name: 'Example Plugin',
          description: 'This is an example plugin',
          homePageUrl: url.replace(supportedURL, ''),
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
            flex: 1,
            backgroundColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.background
                : LightTheme.colors.background,
          }}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Root" component={BottomNavigationBar} />
          </Stack.Navigator>
        </View>
        <InstallPluginDialog
          colorScheme={colorScheme}
          fetchPluginManifest={() => {}}
          hideDialog={hideDialog}
          loadPlugin={() => {}}
          plugin={plugin}
          visible={visible}
        />
        <StatusBar
          backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
      </NavigationContainer>
    </PaperProvider>
  );
}
