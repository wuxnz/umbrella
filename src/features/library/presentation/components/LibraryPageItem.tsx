import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Item from '../../../plugins/data/model/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/core';
import {Favorite} from '../../domain/entities/Favorite';

type DetailsScreenProps = {
  details: {
    item: Item;
  };
};

const LibraryPageItem = ({item}: {item: Favorite}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DetailsScreenProps>>();

  const [showPlaceholder, setShowPlaceholder] = React.useState(false);

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('details', {item: item.item})}>
      <Card.Cover
        source={
          showPlaceholder
            ? require('../../../../../assets/images/placeholders/tall.jpg')
            : {uri: item.item.imageUrl}
        }
        onError={() => setShowPlaceholder(true)}
      />
      <Card.Title
        title={item.item.name}
        titleStyle={{textAlign: 'center'}}
        titleNumberOfLines={2}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={{textAlign: 'center'}}>
          {item.item.description}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default LibraryPageItem;

const styles = StyleSheet.create({
  card: {
    marginRight: 8,
  },
});
