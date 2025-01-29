import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import SearchBar from './presentation/components/SearchBar';
import SearchFiltersSelector from './presentation/components/SearchFiltersSelector';
import {useTheme} from 'react-native-paper';
import {useSearchPageDataStore} from './presentation/state/useSearchPageDataStore';
import CategorySwiper from './presentation/components/CategorySwiper/CategorySwiper';
import {SearchViewModel} from './presentation/viewmodels/SearchViewModel';

const SearchNavigator = () => {
  const theme = useTheme();

  const {
    results,
    setQuery,
    pluginsToSearch,
    alreadyStarted,
    setAlreadyStarted,
    sourceTypesToSearch,
    setSourceTypesToSearch,
  } = useSearchPageDataStore(state => state);

  const searchViewModel = new SearchViewModel();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
            <CategorySwiper category={category} />
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
    height: 125,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
});
