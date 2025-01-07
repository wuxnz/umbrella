import { StatusBar } from "expo-status-bar";
import { useColorScheme, StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";

import { DarkTheme, LightTheme } from "./src/core/theme/theme";
import { useEffect } from "react";
import BottomNavigationBar from "./src/navigation/BottomNavigationBar";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, isReadyRef } from "./RootNavigation";

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {}, [colorScheme]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <PaperProvider theme={colorScheme === "dark" ? DarkTheme : LightTheme}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
      >
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
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
