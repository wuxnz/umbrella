import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Card, Text} from 'react-native-paper';
import Item from '../../../../plugins/data/models/item/Item';

const CategorySwiperItem = ({item}: {item: Item}) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{uri: item.imageUrl}} />
        <Card.Title
          title={item.name}
          titleStyle={{textAlign: 'center'}}
          titleNumberOfLines={2}
        />
        <Card.Content>
          <Text>{item.description}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default CategorySwiperItem;

const styles = StyleSheet.create({
  container: {},
  card: {
    width: 135,
    marginRight: 8,
  },
});
