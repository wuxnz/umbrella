import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import PluginsNavigator from "../features/plugins/PluginsNavigator";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "../core/theme/theme";

// const MusicRoute = () => <Text>Music</Text>;

// const AlbumsRoute = () => <Text>Albums</Text>;

// const RecentsRoute = () => <Text>Recents</Text>;

const SettingsRoute = () => <Text>Settings</Text>;

const BottomNavigationBar = () => {
  const colorScheme = useColorScheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "plugins",
      title: "Plugins",
      focusedIcon: "power-plug",
      unfocusedIcon: "power-plug-outline",
    },
    // { key: "albums", title: "Albums", focusedIcon: "album" },
    // { key: "recents", title: "Recents", focusedIcon: "history" },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    plugins: PluginsNavigator,
    // albums: AlbumsRoute,
    // recents: RecentsRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      theme={colorScheme === "dark" ? DarkTheme : LightTheme}
      activeColor={
        colorScheme === "dark" ? DarkTheme.colors.text : LightTheme.colors.text
      }
      inactiveColor={
        colorScheme === "dark"
          ? DarkTheme.colors.disabled
          : LightTheme.colors.disabled
      }
      barStyle={{
        backgroundColor:
          colorScheme === "dark"
            ? DarkTheme.colors.surface
            : LightTheme.colors.surface,
      }}
      activeIndicatorStyle={{
        backgroundColor:
          colorScheme === "dark"
            ? DarkTheme.colors.primary + "80"
            : LightTheme.colors.primary + "80",
      }}
    />
  );
};

export default BottomNavigationBar;
