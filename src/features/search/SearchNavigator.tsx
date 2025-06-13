import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchBar from './presentation/components/SearchBar';
import SearchFiltersSelector from './presentation/components/SearchFiltersSelector';
import {useTheme} from 'react-native-paper';
import {useSearchPageDataStore} from './presentation/state/useSearchPageDataStore';
import CategorySwiper from './presentation/components/CategorySwiper/CategorySwiper';
import {SearchViewModel} from './presentation/viewmodels/SearchViewModel';
import PaginationBottomSheet from './presentation/components/CategorySwiper/PaginationBottomSheet';
import {Plugin} from '../plugins/domain/entities/Plugin';
import BottomSheet from '@gorhom/bottom-sheet';

const SearchNavigator = () => {
  const theme = useTheme();

  const {results, pluginsToSearch} = useSearchPageDataStore(state => state);

  const searchViewModel = new SearchViewModel();

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const [contentHeight, setContentHeight] = useState(0);

  const onContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        onScroll={handleScroll}
        onContentSizeChange={onContentSizeChange}>
        <View
          style={{
            ...styles.searchBarAndFilters,
            backgroundColor: theme.colors.surface,
          }}>
          <SearchBar onSubmitEditing={searchViewModel.search} />
          <SearchFiltersSelector />
        </View>
        {results.map((category, index) => (
          <View key={index} style={{margin: 16}}>
            <CategorySwiper
              category={category}
              bottomSheetRef={bottomSheetRef}
              plugin={pluginsToSearch[index]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarAndFilters: {
    gap: 8,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
});
