import {View, Text} from 'react-native';
import React from 'react';
import {Plugin} from '../../domain/entities/Plugin';
import {List} from 'react-native-paper';

const PluginListItem = ({plugin}: {plugin: Plugin}) => {
  return <List.Item title={plugin.name} description={plugin.description} />;
};

export default PluginListItem;
