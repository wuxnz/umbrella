import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  AppState,
  Linking,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {usePluginStore} from '../state/usePluginStore';
import constants from '../../../../core/utils/constants';
import {useInstallPluginDialogStore} from '../state/useInstallPluginDialogStore';
import {PluginViewModel} from '../viewmodels/PluginViewModel';
import {checkManagePermission} from 'manage-external-storage';
import GrantPermissionDialog from '../../../../core/shared/components/GrantPermissionDialog';
import {useGrantPermissionDialogStore} from '../state/useGrantPermissionDialogStore';
import InstallPluginDialog from '../../../../core/shared/components/InstallPluginDialog';
import PluginList from '../components/PluginList';
import ConfirmOrDenyDialog from '../../../../core/shared/components/ConfirmOrDenyDialog';
import {DarkTheme, LightTheme} from '../../../../core/theme/theme';

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
          <View style={{height: 16}} />
        </View>
      ) : (
        <View style={styles.pluginList}>
          <PluginList plugins={plugins} />
        </View>
      )}
      {/* <GrantPermissionDialog />
      <InstallPluginDialog /> */}
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
  },
  noPlugins: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  pluginList: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
