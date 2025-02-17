import './gesture-handler';
import {
  useColorScheme,
  StatusBar,
  Alert,
  Platform,
  AppState,
  Linking,
  View,
} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect, useState} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import GrantPermissionDialog from './src/core/shared/components/dialogs/GrantPermissionDialog';

import nodejs from 'nodejs-mobile-react-native';
import {useBottomNavigationBarState} from './src/navigation/useBottomNavigationBarState';
import {PluginViewModel} from './src/features/plugins/presentation/viewmodels/PluginvViewModel';
import {usePluginStore} from './src/features/plugins/presentation/state/usePluginStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {checkManagePermission} from 'manage-external-storage';
import {useGrantPermissionDialogStore} from './src/features/plugins/presentation/state/useGrantPermissionDialogStore';
import InstallPluginDialog from './src/core/shared/components/dialogs/InstallPluginDialog';
import {useInstallPluginDialogStore} from './src/features/plugins/presentation/state/useInstallPluginDialogStore';
import constants from './src/core/utils/constants';
import SplashScreen from 'react-native-splash-screen';
import DetailsNavigator from './src/features/details/DetailsNavigator';
import {useProfileStore} from './src/features/profile/presentation/state/useProfileStore';
import ProfileNavigator from './src/features/profile/ProfileNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  // Start nodejs
  useEffect(() => {
    SplashScreen.hide();
    nodejs.start('main.js');
    // nodejs.channel.addListener('message', message => {
    //   Alert.alert('From NodeJS', message);
    // });
  }, []);

  // Dark mode handling
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  // Check if app & navigation is ready
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const theme = useTheme();

  const {setPlugins} = usePluginStore(state => state);

  const pluginViewModel = new PluginViewModel();

  useEffect(() => {
    pluginViewModel.loadAllPluginsFromStorage().then(result => {
      if (result.status === 'success') {
        setPlugins(result.data!);
      }
    });
  }, []);

  const {
    visible: installVisible,
    setVisible: setInstallVisible,
    setPlugin,
    loading,
    setLoading,
    setOnConfirm: setInstallOnConfirm,
  } = useInstallPluginDialogStore(state => state);

  useEffect(() => {
    if (installVisible) return;
    pluginViewModel.loadAllPluginsFromStorage().then(result => {
      if (result.status === 'success') {
        setPlugins(result.data!);
      }
    });
  }, [installVisible]);

  useEffect(() => {
    Linking.addEventListener('url', async ({url}) => {
      if (loading) {
        return;
      }
      if (url.startsWith(constants.PLUGIN_SCHEME)) {
        setLoading(true);
        setPlugins([]);
        setPlugin(undefined);

        const manifestUrl = url.replace(constants.PLUGIN_SCHEME, 'http://');

        await pluginViewModel.fetchManifest(manifestUrl).then(result => {
          switch (result.status) {
            case 'success': {
              setPlugin(result.data);
              setInstallOnConfirm(async () => {
                await pluginViewModel.fetchPlugin(result.data).then(result => {
                  switch (result.status) {
                    case 'success': {
                      pluginViewModel.registerPlugin(result.data).then(() => {
                        setInstallVisible(false);
                      });
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
              });
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
        pluginViewModel.loadAllPluginsFromStorage().then(result => {
          if (result.status === 'success') {
            setPlugins(result.data!);
          }
        });
      }
    });
  }, []);

  const {profiles, activeProfile} = useProfileStore(state => state);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 0,
          }}
        />
        <SafeAreaView style={{flex: 1, backgroundColor: 'red'}}>
          <PaperProvider
            theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor:
                      colorScheme === 'dark'
                        ? DarkTheme.colors.background
                        : LightTheme.colors.background,
                  },
                }}
                initialRouteName={
                  activeProfile === undefined || profiles.length === 0
                    ? 'profile'
                    : 'root'
                }>
                <Stack.Screen name="profile" component={ProfileNavigator} />
                <Stack.Screen name="root" component={BottomNavigationBar} />
                <Stack.Screen name="details" component={DetailsNavigator} />
              </Stack.Navigator>
              <StatusBar
                backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                barStyle={
                  colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
              />
              <GrantPermissionDialog />
              <InstallPluginDialog />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
