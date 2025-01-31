import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Item from '../../../../plugins/data/models/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/core';

type DetailsScreenProps = {
  details: {
    item: Item;
  };
};

const CategorySwiperItem = ({item}: {item: Item}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DetailsScreenProps>>();

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('details', {item: item})}>
      <Card.Cover source={{uri: item.imageUrl}} />
      <Card.Title
        title={item.name}
        titleStyle={{textAlign: 'center'}}
        titleNumberOfLines={2}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={{textAlign: 'center'}}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default CategorySwiperItem;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginRight: 8,
  },
});
