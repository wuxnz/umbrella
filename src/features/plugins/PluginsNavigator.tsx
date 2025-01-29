import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PluginListView from './presentation/views/PluginListView';
import PluginInfoView from './presentation/views/PluginInfoView';
import {useColorScheme, View} from 'react-native';
import {useTheme} from 'react-native-paper';

const Stack = createNativeStackNavigator();

// PluginsNavigator
// This component is used to navigate to the
// different screens of the plugin feature
const PluginsNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="pluginListView"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="pluginListView" component={PluginListView} />
      <Stack.Screen name="pluginInfoView" component={PluginInfoView} />
    </Stack.Navigator>
  );
};

export default PluginsNavigator;
