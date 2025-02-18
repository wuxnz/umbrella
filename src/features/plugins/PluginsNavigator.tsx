import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PluginListView from './presentation/views/PluginListView';
import PluginInfoView from './presentation/views/PluginInfoView';
import {useColorScheme, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Plugin} from './domain/entities/Plugin';
import {usePluginStore} from './presentation/state/usePluginStore';

const Stack = createNativeStackNavigator();

// PluginsNavigator
// This component is used to navigate to the
// different screens of the plugin feature
const PluginsNavigator = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={{flex: 1}}>
      <PluginListView />
    </View>
  );
};

export default PluginsNavigator;
