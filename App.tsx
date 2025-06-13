if (__DEV__) {
  require('./ReactotronConfig');
}
import './gesture-handler';
import {useColorScheme, StatusBar, Alert, Linking, View} from 'react-native';
import {PaperProvider} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import InstallPluginDialog from './src/core/shared/components/dialogs/InstallPluginDialog';
import constants from './src/core/utils/constants';
import SplashScreen from 'react-native-splash-screen';
import DetailsNavigator from './src/features/details/DetailsNavigator';
import {useProfileStore} from './src/features/profile/presentation/state/useProfileStore';
import ProfileNavigator from './src/features/profile/ProfileNavigator';
import PluginInfoView from './src/features/plugins/presentation/views/PluginInfoView';
import {ExtractorService} from './src/data/services/extractor/data/datasource/ExtractorService';
import MediaType from './src/features/plugins/data/model/media/MediaType';
import ExtractorVideo from './src/features/plugins/data/model/media/ExtractorVideo';

import nodejs from 'nodejs-mobile-react-native';
import {PluginViewModel} from './src/features/plugins/presentation/viewmodels/PluginsViewModel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useInstallPluginDialogStore} from './src/features/plugins/presentation/state/useInstallPluginDialogStore';
import React from 'react';
import ExtractorSourcesBottomSheet from './src/data/services/extractor/presentation/components/ExtractSourcesBottomSheet';
import {useExtractorServiceStore} from './src/data/services/extractor/presentation/state/ExtractorServiceStore';
import BottomSheet from '@gorhom/bottom-sheet';
import {useSearchPageDataStore} from './src/features/search/presentation/state/useSearchPageDataStore';
import PaginationBottomSheet from './src/features/search/presentation/components/CategorySwiper/PaginationBottomSheet';
import {useFavoriteStore} from './src/features/details/presentation/state/useFavoriteStore';
import FavoriteBottomSheet from './src/features/details/presentation/components/FavoriteBottomSheet';

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

  useEffect(() => {
    SplashScreen.hide();
    nodejs.start('main.js');
    // const extract = async () => {
    //   const result = await ExtractorService.extract({
    //     type: MediaType.ExtractorVideo,
    //     url: 'https://s3taku.one/watch?play=125',
    //     name: 'GogoCdn',
    //     iconUrl: 'https://www.svgrepo.com/show/433942/gear.svg',
    //   } as ExtractorVideo);
    //   console.log(result);
    // };
    // extract();
    // nodejs.channel.addListener('message', message => {
    //   Alert.alert('From NodeJS', message);
    // });
  }, []);

  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const pluginViewModel = new PluginViewModel();

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

  useEffect(() => {
    if (installVisible) return;
    const loadPlugins = async () => {
      await pluginViewModel.loadAllPluginsFromStorage();
    };
    loadPlugins();
  }, [installVisible]);

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
                await pluginViewModel
                  .fetchPlugin(result.data)
                  .then(result => {
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
                          `Plugin installation failed\n${result.error}`,
                        );
                        break;
                      }
                      default:
                        break;
                    }
                  })
                  .catch(error => {
                    console.error('Error fetching plugin:', error);
                    Alert.alert(
                      'Installation failed',
                      `An unexpected error occurred during plugin fetch: ${
                        error.message || error
                      }`,
                    );
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

  const extractorBottomSheetRef = React.useRef<BottomSheet>(null);

  const {bottomSheetVisible: extractorBottomSheetVisible} =
    useExtractorServiceStore(state => state);

  useEffect(() => {
    if (extractorBottomSheetVisible) {
      extractorBottomSheetRef.current?.expand();
    }
  }, [extractorBottomSheetVisible]);

  const {bottomSheetVisible: searchBottomSheetVisible} = useSearchPageDataStore(
    state => state,
  );

  const searchBottomSheetRef = React.useRef<BottomSheet>(null);

  useEffect(() => {
    if (searchBottomSheetVisible) {
      searchBottomSheetRef.current?.expand();
    }
  }, [searchBottomSheetVisible]);

  const {visible: favoriteBottomSheetVisible} = useFavoriteStore(
    state => state,
  );

  const favoriteBottomSheetRef = React.useRef<BottomSheet>(null);

  useEffect(() => {
    if (favoriteBottomSheetVisible) {
      favoriteBottomSheetRef.current?.expand();
    }
  }, [favoriteBottomSheetVisible]);

  return (
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
        <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              isReadyRef.current = true;
            }}>
            <GestureHandlerRootView style={{flex: 1}}>
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
                <Stack.Screen
                  name="pluginInfoView"
                  component={PluginInfoView}
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack.Navigator>
              <View>
                <StatusBar
                  backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                  barStyle={
                    colorScheme === 'dark' ? 'light-content' : 'dark-content'
                  }
                />
              </View>
              <InstallPluginDialog />
              {extractorBottomSheetVisible && (
                <ExtractorSourcesBottomSheet
                  bottomSheetRef={extractorBottomSheetRef}
                />
              )}

              {searchBottomSheetVisible && (
                <PaginationBottomSheet bottomSheetRef={searchBottomSheetRef} />
              )}

              {favoriteBottomSheetVisible && (
                <FavoriteBottomSheet bottomSheetRef={favoriteBottomSheetRef} />
              )}
            </GestureHandlerRootView>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
