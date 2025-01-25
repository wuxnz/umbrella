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
import {useNavigation} from '@react-navigation/native';

// BottomNavigationBar
// This component is used to display the bottom navigation bar
// Shown on all top level screens
// Shows a Rail when in landscape mode

const DrawerNavigator = createDrawerNavigator();

const DrawerContent = ({props, setIndex}: any) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        width: 80,
        alignItems: 'center',
      }}>
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="power-plug"
        unfocusedIcon={'power-plug-outline'}
        label="Plugins"
        active={props.navigation.getState().index === 0}
        onPress={() => {
          props.navigation.navigate('plugins');
          setIndex(0);
        }}
        theme={colorScheme === 'dark' ? DarkTheme : LightTheme}
      />
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="cog"
        unfocusedIcon="cog-outline"
        label="Settings"
        active={props.navigation.getState().index === 1}
        onPress={() => {
          props.navigation.navigate('settings');
          setIndex(1);
        }}
        theme={colorScheme === 'dark' ? DarkTheme : LightTheme}
      />
      <View style={{flex: 1}} />
    </DrawerContentScrollView>
  );
};

const SettingsRoute = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const BottomNavigationBar = () => {
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
        drawerContent={props => (
          <DrawerContent props={props} setIndex={setIndex} />
        )}
        initialRouteName={
          index === 0 ? 'plugins' : index === 1 ? 'settings' : 'plugins'
        }
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
