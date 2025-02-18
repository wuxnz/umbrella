import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {Plugin} from '../../domain/entities/Plugin';
import {Icon, IconButton, List} from 'react-native-paper';
import {usePluginStore} from '../state/usePluginStore';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LazyImage from '../../../../core/shared/components/LazyImage';

type RootStackParamList = {
  pluginInfoView: {
    plugin: Plugin;
  };
};

const PluginListItem = ({plugin}: {plugin: Plugin}) => {
  const {setPluginToDelete, setViewInfoPlugin} = usePluginStore.getState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <List.Item
        title={plugin.name}
        description={plugin.description}
        left={props =>
          plugin.iconUrl !== undefined ? (
            <LazyImage
              {...props}
              src={plugin.iconUrl}
              placeholderSource="circle"
              style={styles.pluginIcon}
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
        onPress={() => {
          setViewInfoPlugin(plugin);
          navigation.navigate('pluginInfoView', {plugin});
        }}
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
