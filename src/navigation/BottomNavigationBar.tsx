import * as React from 'react';
import {BottomNavigation, Drawer, Text} from 'react-native-paper';
import PluginsNavigator from '../features/plugins/PluginsNavigator';
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {DarkTheme, LightTheme} from '../core/theme/theme';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {isReadyRef, navigationRef} from '../../RootNavigation';
import {useEffect} from 'react';

const DrawerNavigator = createDrawerNavigator();

const DrawerContent = ({navigation}: any) => {
  const colorScheme = useColorScheme();

  const [lastCheck, setLastCheck] = React.useState(false);

  useEffect(() => {
    if (navigation) {
      isReadyRef.current = true;
      setLastCheck(true);
    } else {
      isReadyRef.current = false;
      setLastCheck(false);
    }
  }, [navigation]);

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        width: 80,
      }}>
      <Drawer.Section
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 16,
        }}>
        <View style={{flex: 1}} />
        <Drawer.CollapsedItem
          focusedIcon="power-plug"
          unfocusedIcon={'power-plug-outline'}
          label="Plugins"
          active={
            lastCheck &&
            navigationRef.current?.getCurrentRoute().name === 'Plugins'
          }
          onPress={() => navigation.navigate('Plugins')}
          theme={colorScheme === 'dark' ? DarkTheme : LightTheme}
        />
        <View style={{flex: 1}} />
        <Drawer.CollapsedItem
          focusedIcon="cog"
          unfocusedIcon="cog-outline"
          label="Settings"
          active={
            lastCheck &&
            navigationRef.current?.getCurrentRoute().name === 'Settings'
          }
          onPress={() => navigation.navigate('Settings')}
        />
        <View style={{flex: 1}} />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const SettingsRoute = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const BottomNavigationBar = (props: any) => {
  const colorScheme = useColorScheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'plugins',
      title: 'Plugins',
      focusedIcon: 'power-plug',
      unfocusedIcon: 'power-plug-outline',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    plugins: PluginsNavigator,
    settings: SettingsRoute,
  });

  const {height, width} = useWindowDimensions();
  const isLandScape = width > height;

  if (isLandScape) {
    return (
      <DrawerNavigator.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        initialRouteName="Plugins"
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.surface
                : LightTheme.colors.surface,
          },
          drawerStyle: {
            width: 80,
            backgroundColor:
              colorScheme === 'dark'
                ? DarkTheme.colors.surface
                : LightTheme.colors.surface,
          },
          drawerType: 'permanent',
        }}
        defaultStatus="open">
        <DrawerNavigator.Screen name="plugins" component={PluginsNavigator} />
        <DrawerNavigator.Screen name="settings" component={SettingsRoute} />
      </DrawerNavigator.Navigator>
    );
  }

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      theme={colorScheme === 'dark' ? DarkTheme : LightTheme}
      barStyle={{
        backgroundColor:
          colorScheme === 'dark'
            ? DarkTheme.colors.surface
            : LightTheme.colors.surface,
      }}
    />
  );
};

export default BottomNavigationBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
