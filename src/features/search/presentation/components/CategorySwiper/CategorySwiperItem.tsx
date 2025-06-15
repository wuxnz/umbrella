import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Card, Text, useTheme} from 'react-native-paper';
import Item from '../../../../plugins/data/model/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/core';
import {useSearchPageDataStore} from '../../state/useSearchPageDataStore';

type DetailsScreenProps = {
  details: {
    item: Item;
  };
};

const CategorySwiperItem = ({item}: {item: Item}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DetailsScreenProps>>();

  const [showPlaceholder, setShowPlaceholder] = React.useState(false);

  const theme = useTheme();

  const {setBottomSheetVisible} = useSearchPageDataStore();

  return (
    <Card
      style={{...styles.card, backgroundColor: theme.colors.surface}}
      mode="contained"
      onPress={() => {
        setBottomSheetVisible(false);
        navigation.navigate('details', {item: item});
      }}>
      <Card.Cover
        source={
          showPlaceholder
            ? require('../../../../../../assets/images/placeholders/tall.jpg')
            : {uri: item.imageUrl}
        }
        onError={() => setShowPlaceholder(true)}
      />
      <Card.Title
        title={item.name}
        titleStyle={{textAlign: 'center'}}
        titleNumberOfLines={2}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={{textAlign: 'center'}}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );
};

export default CategorySwiperItem;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginRight: 8,
  },
});
