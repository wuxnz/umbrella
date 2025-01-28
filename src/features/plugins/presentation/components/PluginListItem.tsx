import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {Plugin} from '../../domain/entities/Plugin';
import {Icon, IconButton, List} from 'react-native-paper';
import {usePluginStore} from '../stores/usePluginStore';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  pluginInfoView: {
    plugin: Plugin;
  };
};

const PluginListItem = ({plugin}: {plugin: Plugin}) => {
  const {setPluginToDelete} = usePluginStore.getState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
        onPress={() => {
          navigation.navigate('pluginInfoView', {plugin: plugin});
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
