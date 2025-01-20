import {MD3DarkTheme as DefaultTheme, MD3LightTheme} from 'react-native-paper';

export const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8c56f0',
    secondary: '#4060ff',
    background: '#151515',
    surface: '#1c1c1c',
    text: '#fff',
    disabled: 'rgba(225, 225, 225, 0.80)',
    placeholder: 'rgba(255, 255, 255, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    secondaryContainer: '#8c56f080',
    onSurface: '#fff',
    onSurfaceVariant: '#ffffff80',
    onSecondaryContainer: '#fff',
  },
};

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8c56f0',
    secondary: '#4060ff',
    background: '#f5f5f5',
    surface: '#fff',
    text: '#000',
    disabled: 'rgba(25, 25, 25, 0.80)',
    placeholder: 'rgba(0, 0, 0, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    secondaryContainer: '#8c56f080',
    onSurface: '#000',
    onSurfaceVariant: '#00000080',
    onSecondaryContainer: '#000',
  },
};
