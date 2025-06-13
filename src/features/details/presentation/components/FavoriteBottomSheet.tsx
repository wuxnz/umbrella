import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {List, useTheme} from 'react-native-paper';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useFavoriteStore} from '../state/useFavoriteStore';
import {
  Favorite,
  FavoriteCategoryType,
} from '../../../library/domain/entities/Favorite';
import Item from '../../../plugins/data/model/item/Item';
import uuid from 'react-native-uuid';

const FavoriteBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
}) => {
  const {item, addFavorite, setVisible} = useFavoriteStore(state => state);

  const theme = useTheme();

  const favoriteCategories = Object.values(FavoriteCategoryType);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['50%']}
      handleStyle={{backgroundColor: theme.colors.surface}}
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      onClose={() => {
        setVisible(false);
      }}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
      }}>
      <BottomSheetView
        style={{
          ...styles.bottomSheetOptions,
          backgroundColor: theme.colors.surface,
        }}>
        {favoriteCategories.map((category, index: number) => (
          <List.Item
            key={index}
            title={category
              .split('_')
              .map(word => word[0].toUpperCase() + word.slice(1))
              .join(' ')}
            onPress={() => {
              addFavorite({
                id: uuid.v4(),
                category: category,
                item: item,
                timestamp: new Date(Date.now()),
                type: item.type,
              } as Favorite);
              setVisible(false);
            }}
          />
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default FavoriteBottomSheet;

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    paddingBottom:
      Dimensions.get('screen').height > Dimensions.get('window').width
        ? 100
        : 0,
  },
  bottomSheetOptions: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginVertical: '1.5%',
  },
});
