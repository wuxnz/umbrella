import {
  View,
  StyleSheet,
  BackHandler,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Item from '../plugins/data/model/item/Item';
import {
  useTheme,
  Text,
  Appbar,
  Chip,
  ActivityIndicator,
  Card,
  IconButton,
  Button,
  DataTable,
  TouchableRipple,
} from 'react-native-paper';
import {DetailsViewModel} from './presentation/viewmodels/DetailsViewModel';
import DetailedItem from '../plugins/data/model/item/DetailedItem';
import LinearGradient from 'react-native-linear-gradient';
import SendIntentAndroid from 'react-native-send-intent';
import LazyImage from '../../core/shared/components/LazyImage';
import {LibraryViewModel} from '../library/presentation/viewmodels/LibraryViewModel';
import {useLibraryPageDataStore} from '../library/presentation/state/useLibraryPageDataStore';
import {useFavoriteStore} from './presentation/state/useFavoriteStore';
import BottomSheet from '@gorhom/bottom-sheet';
import FavoriteBottomSheet from './presentation/components/FavoriteBottomSheet';
import {Favorite} from '../library/domain/entities/Favorite';

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
      const details = await detailsViewModel.fetchDetails(
        item.id,
        item.source!,
      );
      if (details.status === 'success') {
        setDetails(details.data);
      }
      setFetchingDetails(false);
    };
    if (!item.source) {
      return;
    }
    fetchDetails();
  }, [item.id]);

  const [page, setPage] = useState(1);

  const [synopsisCutOff, setSynopsisCutOff] = useState(200);

  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const {currentProfile} = useLibraryPageDataStore(state => state);

  const {
    isFavorited,
    setIsFavorited,
    visible,
    setVisible,
    removeFavorite,
    updateFavorite,
  } = useFavoriteStore(state => state);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const [contentHeight, setContentHeight] = useState(0);

  const onContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  const [itemInFavorites, setItemInFavorites] = useState<Favorite | undefined>(
    undefined,
  );

  useEffect(() => {
    setIsFavorited(false);
  }, []);

  useEffect(() => {
    const itemFoundInFavorites = currentProfile?.favorites?.filter(
      fItem =>
        fItem.item.source?.author === item.source?.author &&
        fItem.item.source?.name === item.source?.name &&
        fItem.item.id === item.id,
    )[0];
    if (itemFoundInFavorites !== undefined) {
      setItemInFavorites(itemFoundInFavorites);
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [setIsFavorited, currentProfile?.favorites]);

  const fetchRawItemMedia = async (index: number): Promise<void> => {
    var media = await detailsViewModel.getItemMedia(
      details!.media[index].id,
      item.source!,
    );
    if (details && details.media.length > 0) {
      await SendIntentAndroid.isAppInstalled('com.mxtech.videoplayer.ad').then(
        async isInstalled => {
          if (isInstalled) {
            await SendIntentAndroid.openAppWithData(
              'com.mxtech.videoplayer.ad',
              media[0].url,
              'video/*',
              {
                title: item.name + ' - ' + details.media[index].name,
                headers: JSON.stringify(media[0].headers),
              },
            );
          } else {
            Alert.alert(
              'MX Player is not installed, would you like to install it?',
              'You can always install it later from the Play Store',
              [
                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: 'Install',
                  onPress: async () => {
                    await SendIntentAndroid.installRemoteApp(
                      'market://details?id=com.mxtech.videoplayer.ad',
                      'com.mxtech.videoplayer.ad',
                    );
                  },
                },
              ],
            );
          }
        },
      );
    }
  };

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
          <Appbar.Action
            icon="heart"
            color={isFavorited ? theme.colors.primary : undefined}
            onPress={() => {
              if (isFavorited) {
                removeFavorite(itemInFavorites!.id);
              } else {
                setVisible(true);
                bottomSheetRef.current?.snapToIndex(1);
              }
            }}
          />
          <Appbar.Action
            icon="bell"
            color={
              itemInFavorites?.notify === true
                ? theme.colors.primary
                : undefined
            }
            onPress={() => {
              if (isFavorited && itemInFavorites !== undefined) {
                updateFavorite(itemInFavorites!.id, {
                  ...itemInFavorites!,
                  notify: !itemInFavorites.notify,
                });
              } else {
                Alert.alert(
                  'Unable to enable notifications',
                  `You must favorite ${item.name} before enabling notifications`,
                  [{text: 'OK', onPress: () => {}}],
                );
              }
            }}
          />
          <Appbar.Action
            icon="earth"
            onPress={() => {
              Linking.openURL(details?.url || '');
            }}
          />
        </Appbar.Header>
        <ScrollView
          onScroll={handleScroll}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={{
            flexGrow: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} />
        </ScrollView>
        {visible && (
          <FavoriteBottomSheet
            item={item}
            bottomSheetRef={bottomSheetRef}
            scrollOffset={scrollOffset}
            contentHeight={contentHeight}
          />
        )}
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
        <Appbar.Action
          icon="heart"
          color={isFavorited ? theme.colors.primary : undefined}
          onPress={() => {
            if (isFavorited) {
              removeFavorite(itemInFavorites!.id);
            } else {
              setVisible(true);
              bottomSheetRef.current?.snapToIndex(1);
            }
          }}
        />
        <Appbar.Action
          icon="bell"
          color={
            itemInFavorites?.notify === true ? theme.colors.primary : undefined
          }
          onPress={() => {
            if (isFavorited && itemInFavorites !== undefined) {
              updateFavorite(itemInFavorites!.id, {
                ...itemInFavorites!,
                notify: !itemInFavorites.notify,
              });
            } else {
              Alert.alert(
                'Unable to enable notifications',
                `You must favorite ${item.name} before enabling notifications`,
                [{text: 'OK', onPress: () => {}}],
              );
            }
          }}
        />
        <Appbar.Action
          icon="earth"
          onPress={() => {
            Linking.openURL(details?.url || '');
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, width: '100%'}}
          onScroll={handleScroll}
          onContentSizeChange={onContentSizeChange}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={
              showPlaceholder
                ? require('../../../assets/images/placeholders/wide.jpg')
                : {uri: details?.imageUrl}
            }
            onError={() => setShowPlaceholder(true)}
            style={styles.banner}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
              style={{flex: 1}}></LinearGradient>
          </ImageBackground>
          <View style={styles.detailsWrapper}>
            <View style={styles.imageAndTitle}>
              <LazyImage
                src={details?.imageUrl}
                placeholderSource="tall"
                style={{
                  width: 125,
                  aspectRatio: 2 / 3,
                  borderRadius: 8,
                }}></LazyImage>
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
            <View style={styles.genresWrapper}>
              <Text
                variant="titleLarge"
                style={{fontWeight: 'bold', marginBottom: 8}}>
                Genres
              </Text>
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
            </View>
            <View style={styles.genresWrapper}>
              <Text
                variant="titleLarge"
                style={{fontWeight: 'bold', marginBottom: 8}}>
                Other Names
              </Text>
              <View style={styles.genres}>
                {details?.otherNames &&
                  details?.otherNames.map((name, index) => (
                    <Chip
                      key={index}
                      style={{
                        backgroundColor: theme.colors.surface,
                      }}>
                      {name}
                    </Chip>
                  ))}
              </View>
            </View>
            <Card>
              <Card.Title title="Synopsis" />
              <Card.Content>
                <Text>
                  {details?.synopsis.slice(0, synopsisCutOff)}
                  {synopsisCutOff === details?.synopsis.length ? '' : '...'}
                </Text>
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
                  <TouchableRipple
                    key={index}
                    onPress={() => {
                      fetchRawItemMedia(index);
                    }}>
                    <DataTable.Row key={index}>
                      {/* <DataTable.Cell>{media.season}</DataTable.Cell> */}
                      <DataTable.Cell>{media.name}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <IconButton icon="play" size={20} />
                      </DataTable.Cell>
                    </DataTable.Row>
                  </TouchableRipple>
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
          {visible && (
            <FavoriteBottomSheet
              item={item}
              bottomSheetRef={bottomSheetRef}
              scrollOffset={scrollOffset}
              contentHeight={contentHeight}
            />
          )}
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
  genresWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
