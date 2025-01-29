import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useSearchPageDataStore} from '../state/useSearchPageDataStore';
import {ScrollView} from 'react-native';
import SourceType from '../../../plugins/data/models/source/SourceType';
import {Chip, useTheme} from 'react-native-paper';

const SearchFiltersSelector = () => {
  const {sourceTypesToSearch, setSourceTypesToSearch} = useSearchPageDataStore(
    state => state,
  );

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        {Object.values(SourceType).map((sourceType, index) => (
          <Chip
            key={sourceType}
            selected={sourceTypesToSearch.includes(SourceType[sourceType])}
            style={{
              backgroundColor: sourceTypesToSearch.includes(
                SourceType[sourceType],
              )
                ? theme.colors.primary
                : theme.colors.backdrop,
            }}
            onPress={() => {
              if (sourceTypesToSearch.includes(SourceType[sourceType])) {
                setSourceTypesToSearch(
                  sourceTypesToSearch.filter(
                    sourceTypeToSearch =>
                      sourceTypeToSearch !== SourceType[sourceType],
                  ),
                );
              } else {
                setSourceTypesToSearch([
                  ...sourceTypesToSearch,
                  SourceType[sourceType],
                ]);
              }
            }}>
            {SourceType[sourceType]}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchFiltersSelector;

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
