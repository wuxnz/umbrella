import * as React from 'react';
import {BottomNavigation, Drawer, Text, useTheme} from 'react-native-paper';
import PluginsNavigator from '../features/plugins/PluginsNavigator';
import {
  AppState,
  Platform,
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import SearchNavigator from '../features/search/SearchNavigator';
import {useBottomNavigationBarState} from './useBottomNavigationBarState';
import {useEffect, useState} from 'react';
import {checkManagePermission} from 'manage-external-storage';
import {usePluginStore} from '../features/plugins/presentation/state/usePluginStore';
import {useGrantPermissionDialogStore} from '../features/plugins/presentation/state/useGrantPermissionDialogStore';

// BottomNavigationBar
// This component is used to display the bottom navigation bar
// Shown on all top level screens
// Shows a Rail when in landscape mode

const DrawerNavigator = createDrawerNavigator();

const DrawerContent = ({props, setIndex}: any) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();

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
        focusedIcon="home"
        unfocusedIcon="home-outline"
        label="Home"
        active={props.navigation.getState().index === 0}
        onPress={() => {
          props.navigation.navigate('home');
          setIndex(0);
        }}
        theme={theme}
      />
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="magnify"
        unfocusedIcon="magnify"
        label="Search"
        active={props.navigation.getState().index === 1}
        onPress={() => {
          props.navigation.navigate('search');
          setIndex(1);
        }}
        theme={theme}
      />
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="library"
        unfocusedIcon="library"
        label="Library"
        active={props.navigation.getState().index === 2}
        onPress={() => {
          props.navigation.navigate('library');
          setIndex(2);
        }}
        theme={theme}
      />
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="power-plug"
        unfocusedIcon={'power-plug-outline'}
        label="Plugins"
        active={props.navigation.getState().index === 3}
        onPress={() => {
          props.navigation.navigate('plugins');
          setIndex(3);
        }}
        theme={theme}
      />
      <View style={{flex: 1}} />
      <Drawer.CollapsedItem
        focusedIcon="cog"
        unfocusedIcon="cog-outline"
        label="Settings"
        active={props.navigation.getState().index === 4}
        onPress={() => {
          props.navigation.navigate('settings');
          setIndex(4);
        }}
        theme={theme}
      />
      <View style={{flex: 1}} />
    </DrawerContentScrollView>
  );
};

const HomeRoute = () => (
  <View style={styles.container}>
    <Text>Home Screen</Text>
  </View>
);

const SearchRoute = () => (
  <View style={styles.container}>
    <Text>Search Screen</Text>
  </View>
);

const LibraryRoute = () => (
  <View style={styles.container}>
    <Text>Library Screen</Text>
  </View>
);

const SettingsRoute = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const BottomNavigationBar = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'search',
      title: 'Search',
      focusedIcon: 'magnify',
      unfocusedIcon: 'magnify',
    },
    {
      key: 'library',
      title: 'Library',
      focusedIcon: 'library',
      unfocusedIcon: 'library',
    },
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
    home: HomeRoute,
    search: SearchNavigator,
    library: LibraryRoute,
    plugins: PluginsNavigator,
    settings: SettingsRoute,
  });

  const {height, width} = useWindowDimensions();
  const isLandScape = width > height;

  const theme = useTheme();

  const {
    setTitle,
    setReason,
    setOnConfirm: setGrantOnConfirm,
    setVisible: setGrantVisible,
  } = useGrantPermissionDialogStore(state => state);

  const {permissionsGranted, onPermissionsGranted} = usePluginStore(
    state => state,
  );

  const [isVisible, setIsVisible] = useState(false);
  const [requested, setRequested] = useState(false);

  useFocusEffect(() => {
    let appStateSubscription;

    const checkVisibility = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    appStateSubscription = AppState.addEventListener('change', checkVisibility);

    checkVisibility(AppState.currentState);

    return () => {
      appStateSubscription.remove();
    };
  });

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const granted = await checkManagePermission();
        if (granted) {
          onPermissionsGranted();
        } else {
          setTitle('Manage External Storage');
          setReason(
            'To install plugins and save data from this app to your device.',
          );
          setGrantOnConfirm(() => setGrantVisible(false));
          setGrantVisible(true);
          setIsVisible(true);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    if (
      Platform.OS === 'android' &&
      isVisible &&
      !requested &&
      !permissionsGranted
    ) {
      requestPermission().then(() => {
        setRequested(true);
      });
    }
  }, [isVisible]);

  const {visible} = useBottomNavigationBarState();

  if (isLandScape) {
    return (
      <DrawerNavigator.Navigator
        drawerContent={props => (
          <DrawerContent props={props} setIndex={setIndex} />
        )}
        initialRouteName={
          index === 0
            ? 'home'
            : index === 1
            ? 'search'
            : index === 2
            ? 'library'
            : index === 3
            ? 'plugins'
            : 'settings'
        }
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme.colors.surface,
          },
          drawerStyle: {
            width: 80,
            backgroundColor: theme.colors.surface,
          },
          drawerType: 'permanent',
        }}
        defaultStatus="open">
        <DrawerNavigator.Screen name="home" component={HomeRoute} />
        <DrawerNavigator.Screen name="search" component={SearchNavigator} />
        <DrawerNavigator.Screen name="library" component={LibraryRoute} />
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
      theme={theme}
      barStyle={{
        backgroundColor: theme.colors.surface,
        display: visible ? 'flex' : 'none',
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
