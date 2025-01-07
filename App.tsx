import { StatusBar } from "expo-status-bar";
import { useColorScheme, StyleSheet, View } from "react-native";
import { PaperProvider, Text } from "react-native-paper";

import { DarkTheme, LightTheme } from "./src/core/theme/theme";
import { useEffect } from "react";
import BottomNavigationBar from "./src/navigation/BottomNavigationBar";

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  return (
    // <NavigationContainer>
    <PaperProvider theme={colorScheme === "dark" ? DarkTheme : LightTheme}>
      <View
        style={{
          ...styles.container,
          backgroundColor:
            colorScheme === "dark"
              ? DarkTheme.colors.background
              : LightTheme.colors.background,
        }}
      >
        <BottomNavigationBar />
      </View>
      <StatusBar style="auto" />
    </PaperProvider>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
