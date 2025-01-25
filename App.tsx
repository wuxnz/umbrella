import './gesture-handler';
import {useColorScheme, StatusBar, Alert} from 'react-native';
import {PaperProvider} from 'react-native-paper';

import {DarkTheme, LightTheme} from './src/core/theme/theme';
import {useEffect} from 'react';
import BottomNavigationBar from './src/navigation/BottomNavigationBar';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef, isReadyRef} from './RootNavigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import GrantPermissionDialog from './src/core/shared/components/GrantPermissionDialog';

import nodejs from 'nodejs-mobile-react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  // Start nodejs
  useEffect(() => {
    nodejs.start('main.js');
    nodejs.channel.addListener('message', message => {
      Alert.alert('From NodeJS', message);
    });
  });

  // Dark mode handling
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  // Check if app & navigation is ready
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
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
  );
}
