import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

const LibraryNavigator = () => {
  return (
    <View style={styles.container}>
      <Text>LibraryNavigator</Text>
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
});
