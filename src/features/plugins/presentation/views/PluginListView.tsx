import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, StyleSheet, View} from 'react-native';
import {
  Text,
  Button,
  Dialog,
  FAB,
  Portal,
  useTheme,
  TextInput,
} from 'react-native-paper';
import {usePluginStore} from '../state/usePluginStore';
import PluginList from '../components/PluginList';
import ConfirmOrDenyDialog from '../../../../core/shared/components/dialogs/ConfirmOrDenyDialog';
import {useInstallPluginDialogStore} from '../state/useInstallPluginDialogStore';
import {PluginViewModel} from '../viewmodels/PluginsViewModel';

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

const PluginListView = () => {
  const {plugins} = usePluginStore(state => state);

  const {deletePlugin, pluginToDelete, setPluginToDelete} = usePluginStore(
    state => state,
  );
  const [showAddPluginDialog, setShowAddPluginDialog] = useState(false);
  useEffect(() => {}, [pluginToDelete]);

  const theme = useTheme();

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}>
      {plugins.length === 0 ? (
        <View style={styles.noPlugins}>
          <Text>Waiting for plugins to load</Text>
          <View style={{height: 8}} />
          <Text>¯\_( ͡° ͜ʖ ͡°)_/¯</Text>
        </View>
      ) : (
        <View style={styles.pluginList}>
          <PluginList plugins={plugins} />
        </View>
      )}
      {pluginToDelete && (
        <ConfirmOrDenyDialog
          visible={Boolean(pluginToDelete)}
          onConfirm={async () => {
            await deletePlugin(pluginToDelete);
            setPluginToDelete(null);
          }}
          onCancel={() => setPluginToDelete(null)}
          title={`Delete ${pluginToDelete.name}?`}
          reason="Are you sure you want to delete this plugin?"
        />
      )}
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
      <AddPluginDialog
        visible={showAddPluginDialog}
        onDismiss={() => {
          setShowAddPluginDialog(false);
        }}
      />
    </View>
  );
};

export default PluginListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  noPlugins: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pluginList: {
    flex: 1,
    width: '100%',
    height: '100%',
    maxWidth: Dimensions.get('window').width - 16,
  },
});
