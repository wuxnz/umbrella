import {
  MD3DarkTheme as DefaultTheme,
  MD3LightTheme,
} from "react-native-paper";

export const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#8c56f0",
    secondary: "#4060ff",
    background: "#000000",
    surface: "#000000",
    text: "#fff",
    disabled: "rgba(255, 255, 255, 0.38)",
    placeholder: "rgba(255, 255, 255, 0.54)",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#8c56f0",
    secondary: "#4060ff",
    background: "#f5f5f5",
    surface: "#fff",
    text: "#000",
    disabled: "rgba(0, 0, 0, 0.38)",
    placeholder: "rgba(0, 0, 0, 0.54)",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
};
