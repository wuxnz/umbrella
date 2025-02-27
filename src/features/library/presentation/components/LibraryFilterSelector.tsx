import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {FavoriteCategoryType} from '../../domain/entities/Favorite';
import {Chip, useTheme} from 'react-native-paper';
import {useLibraryPageDataStore} from '../state/useLibraryPageDataStore';

const LibraryFiltersSelector = () => {
  const {categoriesToShow, setCategoriesToShow} = useLibraryPageDataStore(
    state => state,
  );

  console.log(categoriesToShow);

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        {Object.values(FavoriteCategoryType).map((category, index) => (
          <Chip
            key={category}
            selected={categoriesToShow.includes(
              Object.values(FavoriteCategoryType)[index],
            )}
            style={{
              backgroundColor: categoriesToShow.includes(category)
                ? theme.colors.primary
                : theme.colors.backdrop,
            }}
            onPress={() => {
              console.log(category);
              if (categoriesToShow.includes(category)) {
                setCategoriesToShow(
                  categoriesToShow.filter(item => item !== category),
                );
              } else {
                setCategoriesToShow([...categoriesToShow, category]);
              }
            }}>
            {category}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

export default LibraryFiltersSelector;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginLeft: 8,
  },
  scrollView: {
    columnGap: 8,
    paddingRight: 16,
  },
});
