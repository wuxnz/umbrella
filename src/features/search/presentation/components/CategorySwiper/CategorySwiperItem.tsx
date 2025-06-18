import {StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import Item from '../../../../plugins/data/model/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/core';
import {useSearchPageDataStore} from '../../state/useSearchPageDataStore';
import CardList from '../../../../../core/shared/components/CardList';

type DetailsScreenProps = {
  details: {
    item: Item;
  };
};

const CategorySwiperItem = ({item}: {item: Item}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DetailsScreenProps>>();

  const theme = useTheme();

  const {setBottomSheetVisible} = useSearchPageDataStore();

  return (
    <CardList
      item={item}
      navigation={navigation}
      style={{...styles.card, backgroundColor: theme.colors.surface}}
      mode="contained"
      onPress={() => {
        setBottomSheetVisible(false);
        navigation.navigate('details', {item: item});
      }}
    />
  );
};

export default CategorySwiperItem;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginRight: 8,
  },
});
