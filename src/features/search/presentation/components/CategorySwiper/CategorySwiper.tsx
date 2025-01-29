import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import Category from '../../../../plugins/data/models/item/Category';
import {Card} from 'react-native-paper';
import CategorySwiperItem from './CategorySwiperItem';

const CategorySwiper = ({category}: {category: Category}) => {
  return (
    <View>
      <View>
        <Text>{category.name}</Text>
      </View>
      <View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {category.items.map((item, index) => (
            <CategorySwiperItem key={index} item={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategorySwiper;
