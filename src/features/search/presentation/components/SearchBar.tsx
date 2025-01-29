import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {useSearchPageDataStore} from '../state/useSearchPageDataStore';
import SourceType from '../../../plugins/data/models/source/SourceType';

const SearchBar = ({
  onSubmitEditing,
}: {
  onSubmitEditing: (
    query: string,
    pluginsSourceTypesToSearch?: SourceType[],
  ) => Promise<void>;
}) => {
  const {query, setQuery, sourceTypesToSearch} = useSearchPageDataStore(
    state => state,
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={text => setQuery(text)}
        label="Search"
        mode="outlined"
        style={{paddingLeft: 6}}
        outlineStyle={{borderRadius: 80}}
        underlineStyle={{display: 'none'}}
        onSubmitEditing={() => onSubmitEditing(query, sourceTypesToSearch)}
        right={<TextInput.Icon icon="magnify" />}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
});
