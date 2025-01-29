import './gesture-handler';
import {useColorScheme, StatusBar, Alert} from 'react-native';
import {PaperProvider, useTheme} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import GrantPermissionDialog from './src/core/shared/components/GrantPermissionDialog';

import nodejs from 'nodejs-mobile-react-native';
import {useBottomNavigationBarState} from './src/navigation/useBottomNavigationBarState';
import {PluginViewModel} from './src/features/plugins/presentation/viewmodels/PluginViewModel';
import {usePluginStore} from './src/features/plugins/presentation/state/usePluginStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  // Start nodejs
  useEffect(() => {
    nodejs.start('main.js');
    // nodejs.channel.addListener('message', message => {
    //   Alert.alert('From NodeJS', message);
    // });
  });

  // Dark mode handling
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  const {setPlugins} = usePluginStore(state => state);

  // Check if app & navigation is ready
  useEffect(() => {
    const loadPluginsOnMount = async () => {
      const plugins = await new PluginViewModel().loadAllPluginsFromStorage();

      if (plugins.status === 'success') {
        setPlugins(plugins.data!);
      }
    };

    loadPluginsOnMount();
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const theme = useTheme();

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: theme.colors.background,
          }}>
          <PaperProvider
            theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Root" component={BottomNavigationBar} />
              </Stack.Navigator>
              <GrantPermissionDialog />
              <StatusBar
                backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
                barStyle={
                  colorScheme === 'dark' ? 'light-content' : 'dark-content'
                }
              />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
