import {
  View,
  StyleSheet,
  BackHandler,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Item from '../plugins/data/models/item/Item';
import {
  useTheme,
  Text,
  Appbar,
  Chip,
  ActivityIndicator,
  Card,
  IconButton,
  Icon,
  Button,
  DataTable,
} from 'react-native-paper';
import {useBottomNavigationBarState} from '../../navigation/useBottomNavigationBarState';
import {DetailsViewModel} from './presentation/viewmodels/DetailsViewModel';
import DetailedItem from '../plugins/data/models/item/DetailedItem';
import Status from '../../core/shared/types/Status';
import LinearGradient from 'react-native-linear-gradient';

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
  const [details, setDetails] = useState<DetailedItem>();

  useEffect(() => {
    const fetchDetails = async () => {
      setFetchingDetails(true);
      const details = await detailsViewModel.fetchDetails(item.id, item.source);
      if (details.status === 'success') {
        setDetails(details.data);
      }
      setFetchingDetails(false);
    };

    fetchDetails();
  }, [item.id]);

  const [page, setPage] = useState(1);

  const [synopsisCutOff, setSynopsisCutOff] = useState(200);

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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} />
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
            navigation.goBack();
          }}
        />
        <Appbar.Content title={item.name} />
        <Appbar.Action icon="heart" />
        <Appbar.Action icon="bell" />
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, width: '100%'}}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={{uri: details?.imageUrl}}
            style={styles.banner}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
              style={{flex: 1}}></LinearGradient>
          </ImageBackground>
          <View style={styles.detailsWrapper}>
            <View style={styles.imageAndTitle}>
              <Image
                source={{uri: details?.imageUrl}}
                style={{
                  width: 125,
                  aspectRatio: 2 / 3,
                  borderRadius: 8,
                }}></Image>
              <View style={styles.headlineInfo}>
                <Text
                  variant="headlineMedium"
                  style={{fontWeight: 'bold'}}
                  numberOfLines={3}>
                  {item.name}
                </Text>
                <Text variant="bodyLarge">{details?.description}</Text>
                <Text variant="bodyMedium">{details?.language}</Text>
                <Text variant="bodyMedium">{details?.releaseDate}</Text>
                <Text variant="bodyMedium">{details?.status}</Text>
              </View>
            </View>
            <View style={styles.genres}>
              {details?.genres &&
                details?.genres.map((genre, index) => (
                  <Chip
                    key={index}
                    style={{
                      backgroundColor: theme.colors.surface,
                    }}>
                    {genre.name}
                  </Chip>
                ))}
            </View>
            <Card>
              <Card.Title title="Synopsis" />
              <Card.Content>
                <Text>{details?.synopsis.slice(0, synopsisCutOff)}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="text"
                  onPress={() => {
                    if (synopsisCutOff === details?.synopsis.length) {
                      setSynopsisCutOff(200);
                    } else {
                      setSynopsisCutOff(details?.synopsis.length || 0);
                    }
                  }}
                  icon={
                    synopsisCutOff === details?.synopsis.length
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  contentStyle={{flexDirection: 'row-reverse'}}>
                  {synopsisCutOff === details?.synopsis.length
                    ? 'Show less'
                    : 'Show more'}
                </Button>
              </Card.Actions>
            </Card>
            <DataTable>
              <DataTable.Header>
                {/* <DataTable.Title>Seasons</DataTable.Title> */}
                <DataTable.Title>Episodes</DataTable.Title>
                <DataTable.Title numeric>Open</DataTable.Title>
              </DataTable.Header>
              {details?.media
                .sort((a, b) => a.number - b.number)
                .slice((page - 1) * 10, page * 10)
                .map((media, index) => (
                  <DataTable.Row key={index}>
                    {/* <DataTable.Cell>{media.season}</DataTable.Cell> */}
                    <DataTable.Cell>{media.name}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton icon="play" />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil((details?.media.length || 1) / 10) + 1}
                onPageChange={page => {
                  if (page === 0) {
                    page = 1;
                  }
                  setPage(page);
                }}
                label={`${page} of ${Math.ceil(
                  (details?.media.length || 1) / 10,
                )} pages`}
                numberOfItemsPerPage={10}
                onItemsPerPageChange={() => {
                  setPage(1);
                }}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
              />
            </DataTable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DetailsNavigator;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {},
  banner: {
    width: '100%',
    height: 200,
  },
  detailsWrapper: {
    marginTop: -75,
    width: '100%',
    rowGap: 8,
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  imageAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  headlineInfo: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 8,
    paddingRight: 8,
    width: Dimensions.get('window').width - 200,
    rowGap: 2,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
