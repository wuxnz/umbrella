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
    } catch (e) {}
  }, [currentProfile, categoriesToShow]);

  return (
    <View>
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
            <View style={styles.itemGrid}>
              {items?.map((item: Favorite, index: number) => (
                <View
                  key={index}
                  style={{
                    width: '33%',
                  }}>
                  <LibraryPageItem item={item} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
      <View style={styles.filterContainer}>
        <LibraryFiltersSelector />
      </View>
    </View>
  );
};

export default LibraryNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    marginLeft: '2%',
  },
  itemGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    rowGap: 16,
    flexWrap: 'wrap',
  },
  nothingMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {},
});
