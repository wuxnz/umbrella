import {View, Text} from 'react-native';
import React from 'react';
import {Plugin} from '../../domain/entities/Plugin';
import {useTheme, List} from 'react-native-paper';
import PluginListItem from './PluginListItem';

const PluginList = ({plugins}: {plugins: Plugin[]}) => {
  const theme = useTheme();

  return (
    <List.Section style={{flex: 1}}>
      {plugins.map(plugin => (
        <PluginListItem key={plugin.name} plugin={plugin} />
      ))}
    </List.Section>
  );
};

export default PluginList;
