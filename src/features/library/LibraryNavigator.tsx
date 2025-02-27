import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import LibraryFiltersSelector from './presentation/components/LibraryFilterSelector';
import {useLibraryPageDataStore} from './presentation/state/useLibraryPageDataStore';
import {Favorite, FavoriteCategoryType} from './domain/entities/Favorite';
import LibraryPageItem from './presentation/components/LibraryPageItem';
import {ScrollView} from 'react-native-gesture-handler';

const LibraryNavigator = () => {
  const {currentProfile, categoriesToShow, setCategoriesToShow} =
    useLibraryPageDataStore(state => state);

  const [items, setItems] = useState<Favorite[]>([]);

  useEffect(() => {
    try {
      setItems(
        currentProfile.favorites?.filter(item =>
          categoriesToShow.includes(item.category || ''),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  }, [currentProfile, categoriesToShow]);

  return (
    <>
      {items?.length == 0 ? (
        <View style={styles.container}>
          <View style={styles.nothingMessage}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <Text>Nothing Yet</Text>
              <View style={{height: 8}} />
              <Text>┐(︶▽︶)┌</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            {items.map((item: Favorite, index: number) => (
              <View
                style={{
                  width: '32%',
                  // height: 'auto',
                  // height
                }}>
                <LibraryPageItem key={index} item={item} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.filterContainer}>
        <LibraryFiltersSelector />
      </View>
    </>
  );
};

export default LibraryNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    padding: '2%',
    backgroundColor: 'blue',
  },
  nothingMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {},
});
