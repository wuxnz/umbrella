import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {Plugin} from '../../domain/entities/Plugin';
import {Icon, IconButton, List} from 'react-native-paper';
import Status from '../../../../core/shared/types/Status';
import {usePluginStore} from '../stores/usePluginStore';
import ConfirmOrDenyDialog from '../../../../core/shared/components/ConfirmOrDenyDialog';

const PluginListItem = ({plugin}: {plugin: Plugin}) => {
  const {setPluginToDelete} = usePluginStore.getState();

  return (
    <>
      <List.Item
        title={plugin.name}
        description={plugin.description}
        left={props =>
          plugin.iconUrl !== undefined ? (
            <Image
              {...props}
              source={{uri: plugin.iconUrl}}
              style={styles.pluginIcon}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.pluginIcon}>
              <Icon {...props} source="power-plug" size={50} />
            </View>
          )
        }
        right={props => (
          <IconButton
            {...props}
            icon="trash-can"
            onPress={() => {
              setPluginToDelete(plugin);
            }}
          />
        )}
        onPress={() => {}}
      />
    </>
  );
};

export default PluginListItem;

const styles = StyleSheet.create({
  pluginIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 10,
  },
});
