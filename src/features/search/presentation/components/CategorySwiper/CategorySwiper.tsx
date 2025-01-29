import {View, ScrollView, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import Category from '../../../../plugins/data/models/item/Category';
import {IconButton, Text, useTheme} from 'react-native-paper';
import CategorySwiperItem from './CategorySwiperItem';
import {useSearchPageDataStore} from '../../state/useSearchPageDataStore';

const CategorySwiper = ({
  category,
  bottomSheetRef,
}: {
  category: Category;
  bottomSheetRef: any;
}) => {
  const theme = useTheme();

  const {setBottomSheetVisible, setBottomSheetActivePlugin} =
    useSearchPageDataStore(state => state);

  return (
    <View>
      <View style={styles.container}>
        <View style={{marginBottom: 16}}>
          <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
            {category.name}
          </Text>
          <Text>{category.description}</Text>
        </View>
        <IconButton
          icon="arrow-right"
          iconColor={theme.colors.onBackground}
          onPress={() => {
            if (!category.source) return;
            setBottomSheetActivePlugin(category.source);
            setBottomSheetVisible(true);
            // bottomSheetRef.current.close();
            // bottomSheetRef.current?.expand();
            bottomSheetRef.current?.snapToIndex(0);
          }}
        />
      </View>
      <View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}>
          {category.items.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <CategorySwiperItem key={index} item={item} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategorySwiper;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    paddingRight: 16,
  },
  scrollView: {
    marginRight: -16,
    marginLeft: -8,
  },
  cardWrapper: {
    width: 135,
    marginRight: 8,
  },
});
