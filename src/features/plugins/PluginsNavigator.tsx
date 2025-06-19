import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PluginListView from './presentation/views/PluginListView';
import {View} from 'react-native';
import {
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
const Stack = createNativeStackNavigator();

// PluginsNavigator
// This component is used to navigate to the
// different screens of the plugin feature
const PluginsNavigator = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={{flex: 1, width: '100%'}}>
      <PluginListView />
    </View>
  );
};

export default PluginsNavigator;
