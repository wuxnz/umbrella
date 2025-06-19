import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PluginListView from './presentation/views/PluginListView';
import {View, Alert} from 'react-native';
import {
  Text,
  Button,
  Dialog,
  FAB,
  Portal,
  useTheme,
  TextInput,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useInstallPluginDialogStore} from './presentation/state/useInstallPluginDialogStore';
import {PluginViewModel} from './presentation/viewmodels/PluginsViewModel';
const Stack = createNativeStackNavigator();

const AddPluginDialog = ({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) => {
  const [pluginManifestUrl, setPluginManifestUrl] = useState('');
  const {
    visible: installVisible,
    setVisible: setInstallVisible,
    plugin,
    setPlugin,
    loading,
    setLoading,
    setOnConfirm: setInstallOnConfirm,
    setWaitingForPlugins,
  } = useInstallPluginDialogStore(state => state);
  const pluginViewModel = new PluginViewModel();

  const handleInstallPlugin = async () => {
    // Basic validation before proceeding
    if (
      !pluginManifestUrl.startsWith('http') ||
      !pluginManifestUrl.endsWith('.json')
    ) {
      Alert.alert(
        'Invalid URL',
        'Please enter a valid plugin manifest URL that starts with "http" and ends with ".json".',
      );
      return;
    }

    setInstallVisible(true);
    setLoading(true);
    setWaitingForPlugins(true);
    setPlugin(undefined);

    await pluginViewModel.fetchManifest(pluginManifestUrl).then(result => {
      switch (result.status) {
        case 'success': {
          setPlugin(result.data);
          setWaitingForPlugins(false);
          setInstallVisible(true);
          setInstallOnConfirm(async () => {
            await pluginViewModel
              .fetchPlugin(result.data)
              .then(result => {
                switch (result.status) {
                  case 'success': {
                    Alert.alert(
                      'Installation successful',
                      `Plugin ${result.data.name} installed successfully`,
                    );
                    pluginViewModel.loadAllPluginsFromStorage();
                    break;
                  }
                  case 'error': {
                    Alert.alert(
                      'Installation failed',
                      `Plugin installation failed\n${result.error}`,
                    );
                    break;
                  }
                  default:
                    break;
                }
              })
              .catch(error => {
                console.error('Error fetching plugin:', error);
                Alert.alert(
                  'Installation failed',
                  `An unexpected error occurred during plugin fetch: ${
                    error.message || error
                  }`,
                );
              });
          });
          break;
        }
        case 'error': {
          console.error(result.error);
          break;
        }
        default:
          break;
      }
    });
    setInstallVisible(true);
    setLoading(false);
  };
  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss}>
          <Dialog.Title>Add Plugin</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">The Url should end with .json</Text>
            <TextInput
              label="Plugin URL"
              value={pluginManifestUrl}
              mode="outlined"
              onChangeText={text => setPluginManifestUrl(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                onDismiss();
                handleInstallPlugin();
              }}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

// PluginsNavigator
// This component is used to navigate to the
// different screens of the plugin feature
const PluginsNavigator = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [showAddPluginDialog, setShowAddPluginDialog] = useState(false);

  return (
    <View style={{flex: 1, width: '100%'}}>
      <PluginListView />
      <>
        <FAB
          icon="plus"
          color={theme.colors.onSurface}
          style={{
            backgroundColor: theme.colors.surface,
            position: 'absolute',
            bottom: 8,
            right: 8,
          }}
          onPress={() => {
            setShowAddPluginDialog(true);
          }}
        />
      </>
      <AddPluginDialog
        visible={showAddPluginDialog}
        onDismiss={() => {
          setShowAddPluginDialog(false);
        }}
        onShow={() => setShowAddPluginDialog(true)}
      />
    </View>
  );
};

export default PluginsNavigator;
