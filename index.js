import 'react-native-url-polyfill/auto';

/**
 * @format
 */

// Test with no polyfills at all
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
