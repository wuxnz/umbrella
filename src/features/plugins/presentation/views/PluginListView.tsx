import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {usePluginStore} from '../state/usePluginStore';
import PluginList from '../components/PluginList';
import ConfirmOrDenyDialog from '../../../../core/shared/components/dialogs/ConfirmOrDenyDialog';

const PluginListView = () => {
  const {plugins} = usePluginStore(state => state);

  const {deletePlugin, pluginToDelete, setPluginToDelete} = usePluginStore(
    state => state,
  );

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
            return setPluginToDelete(null);
          }}
          onCancel={() => setPluginToDelete(null)}
          title={`Delete ${pluginToDelete.name}?`}
          reason="Are you sure you want to delete this plugin?"
        />
      )}
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
  },
});
