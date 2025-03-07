if (__DEV__) {
  require('./ReactotronConfig');
}
import './gesture-handler';
import {
  useColorScheme,
  StatusBar,
  Alert,
  Platform,
  AppState,
  Linking,
  View,
  Text,
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
import {PluginViewModel} from './src/features/plugins/presentation/viewmodels/PluginsViewModel';
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
import PluginInfoView from './src/features/plugins/presentation/views/PluginInfoView';
import PluginListView from './src/features/plugins/presentation/views/PluginListView';
import {ExtractorService} from './src/data/services/extractor/data/datasource/ExtractorService';
import MediaType from './src/features/plugins/data/model/media/MediaType';
import ExtractorVideo from './src/features/plugins/data/model/media/ExtractorVideo';

const Stack = createNativeStackNavigator();

export default function App() {
  // Extractor Tests
  // useEffect(() => {
  //   const extractorServiceExtract = async () => {
  //     const result = await ExtractorService.extract({
  //       type: MediaType.ExtractorVideo,
  //       url: 'https://alions.pro/v/22ly8zuqj9n2',
  //       name: 'test',
  //       iconUrl: 'https://ww27.gogoanimes.fi/img/vidhide.png',
  //       headers: {
  //         'User-Agent':
  //           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  //         Referer: 'https://ww27.gogoanimes.fi/',
  //       },
  //     } as ExtractorVideo).then(result => {
  //       console.log(result);
  //       return result;
  //     });
  //   };

  //   console.log('running');
  //   extractorServiceExtract();
  // }, []);
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

  // Load all plugins from disk on app start
  useEffect(() => {
    const loadPlugins = async () => {
      await pluginViewModel.loadAllPluginsFromStorage();
    };
    loadPlugins();
  }, []);

  const {
    visible: installVisible,
    setVisible: setInstallVisible,
    plugin,
    setPlugin,
    loading,
    setLoading,
    setOnConfirm: setInstallOnConfirm,
    setWaitingForPlugins,
  } = useInstallPluginDialogStore(state => state);

  // If install dialog closes, load all plugins
  useEffect(() => {
    if (installVisible) return;
    const loadPlugins = async () => {
      await pluginViewModel.loadAllPluginsFromStorage();
    };
    loadPlugins();
  }, [installVisible]);

  // Listen for deep links to plugins and prompt for install
  useEffect(() => {
    Linking.addEventListener('url', async ({url}) => {
      if (loading) {
        return;
      }
      if (url.startsWith(constants.PLUGIN_SCHEME)) {
        setInstallVisible(true);
        setLoading(true);
        setWaitingForPlugins(true);
        setPlugin(undefined);

        const manifestUrl = url.replace(constants.PLUGIN_SCHEME, 'http://');

        await pluginViewModel.fetchManifest(manifestUrl).then(result => {
          switch (result.status) {
            case 'success': {
              setPlugin(result.data);
              setWaitingForPlugins(false);
              setInstallVisible(true);
              setInstallOnConfirm(async () => {
                await pluginViewModel.fetchPlugin(result.data).then(result => {
                  switch (result.status) {
                    case 'success': {
                      Alert.alert(
                        'Installation successful',
                        `Plugin ${result.data.name} installed successfully`,
                      );
                      pluginViewModel.loadAllPluginsFromStorage();
                      break;
                    }
                    case 'error': {
                      Alert.alert(
                        'Installation failed',
                        `Plugin installation failed`,
                      );
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
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.background
                : LightTheme.colors.background,
          }}>
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
                  // 'root'
                  activeProfile === undefined || profiles.length === 0
                    ? 'profile'
                    : 'root'
                }>
                <Stack.Screen name="profile" component={ProfileNavigator} />
                <Stack.Screen name="root" component={BottomNavigationBar} />
                <Stack.Screen name="details" component={DetailsNavigator} />
                <Stack.Screen
                  name="pluginInfoView"
                  component={PluginInfoView}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
              <View>
                <Text>Hello World</Text>
                <StatusBar
                  backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                  barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                  }
                />
              </View>
              <GrantPermissionDialog />
              <InstallPluginDialog />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
