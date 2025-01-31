import {View, StyleSheet, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Item from '../plugins/data/models/item/Item';
import {useTheme, Text, Appbar} from 'react-native-paper';
import {useBottomNavigationBarState} from '../../navigation/useBottomNavigationBarState';
import {DetailsViewModel} from './presentation/viewmodels/DetailsViewModel';
import DetailedItem from '../plugins/data/models/item/DetailedItem';

type DetailsNavigatorParams = {
  item: Item;
};

const DetailsNavigator = () => {
  const route = useRoute();
  const {item} = route.params as DetailsNavigatorParams;

  const theme = useTheme();

  const navigation = useNavigation();

  const [fetchingDetails, setFetchingDetails] = useState(false);

  const detailsViewModel = new DetailsViewModel();
  const [details, setDetails] = useState<DetailedItem | undefined>();

  console.log('details', details);
  console.log('item source', item.source);
  console.log(fetchingDetails);

  useEffect(() => {
    const fetchDetails = async () => {
      setFetchingDetails(true);
      const details = await detailsViewModel.fetchDetails(item.id, item.source);
      console.log('details', details);
      setDetails(details);
      setFetchingDetails(false);
    };

    fetchDetails();
  }, [item.id]);

  if (fetchingDetails) {
    return (
      <View
        style={{...styles.container, backgroundColor: theme.colors.background}}>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={item.name} />
          <Appbar.Action icon="heart" />
          <Appbar.Action icon="bell" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            // setVisible(true);
            navigation.goBack();
          }}
        />
        <Appbar.Content title={item.name} />
        <Appbar.Action icon="heart" />
        <Appbar.Action icon="bell" />
        {/* <Appbar.Action
          icon="earth"
          onPress={() => {
            // if (item.homePageUrl === undefined) return;
            // {
            //   if (item.homePageUrl === undefined) return;
            //   Linking.openURL(item.homePageUrl);
            // }
          }}
        />
        <Appbar.Action
          icon="share"
          onPress={() => {
            // if (item.homePageUrl === undefined) return;
            // Share.share(
            //   {
            //     title: item.name,
            //     url: item.homePageUrl,
            //     message: item.homePageUrl,
            //   },
            //   {
            //     dialogTitle: item.name,
            //     subject: item.name,
            //     tintColor: 'black',
            //   },
            // );
          }}
        /> */}
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <View style={styles.content}>
        <Text>{item.name}</Text>
      </View>
    </View>
  );
};

export default DetailsNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
