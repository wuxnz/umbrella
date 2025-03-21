import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  StatusBar,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  List,
  useTheme,
  Text,
  Icon,
} from 'react-native-paper';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import uuid from 'react-native-uuid';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import MediaType from '../../../../../features/plugins/data/model/media/MediaType';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import {useExtractorServiceStore} from '../state/ExtractorServiceStore';
import SendIntentAndroid from 'react-native-send-intent';
import DetailedItem from '../../../../../features/plugins/data/model/item/DetailedItem';
import {ExtractorViewModel} from '../viewmodels/ExtractorViewModel';
import LazyImage from '../../../../../core/shared/components/LazyImage';

const ExtractorSourcesBottomSheet = ({
  bottomSheetRef,
  scrollOffset,
  contentHeight,
  detailedItem,
  index,
}: {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  scrollOffset: number;
  contentHeight: number;
  detailedItem: DetailedItem;
  index: number;
}) => {
  const theme = useTheme();

  const paddingToAddBottomSheet =
    contentHeight -
    scrollOffset -
    Dimensions.get('screen').height +
    (Dimensions.get('screen').height - Dimensions.get('window').height) +
    (StatusBar.currentHeight || 24);

  const {
    extracting,
    setExtracting,
    setBottomSheetVisible: setVisible,
    rawSources,
    setRawSources,
    sources,
    setSources,
  } = useExtractorServiceStore(state => state);

  const extractorViewModel = new ExtractorViewModel();

  const [noSources, setNoSources] = useState<boolean>(false);

  useEffect(() => {
    const doExtraction = async () => {
      var sourcesToBeExtracted: (
        | ExtractorAudio
        | RawAudio
        | ExtractorVideo
        | RawVideo
      )[] = [];
      rawSources.map(source => {
        if (
          source.type === MediaType.ExtractorAudio ||
          source.type === MediaType.ExtractorVideo
        ) {
          sourcesToBeExtracted.push(source);
        }
      });
      setSources(
        rawSources.filter(source => !sourcesToBeExtracted.includes(source)) as (
          | RawAudio
          | RawVideo
        )[],
      );
      (rawSources as (ExtractorAudio | ExtractorVideo)[]).forEach(
        async (source, index: number) => {
          await extractorViewModel.extract(source).then(result => {
            result.map((extractedSource: RawAudio | RawVideo) => {
              setSources([...sources, extractedSource]);
            });
          });
        },
      );
    };

    const startExtraction = async () => {
      if (rawSources.length > 0) {
        setExtracting(true);
        await doExtraction().then(() => {
          setExtracting(false);
        });
      }
    };

    if (!extracting) {
      startExtraction();
    }
  }, [rawSources.length]);

  useEffect(() => {
    if (sources.length < 0 && !extracting) {
      setNoSources(true);
    }
  }, [extracting, sources.length]);

  const openMedia = async (
    media: RawAudio | RawVideo,
    item: DetailedItem,
    index: number = 0,
    mediaPlayerToOpen: 'mxplayer' | 'webvideocast' = 'webvideocast',
  ): Promise<void> => {
    if (mediaPlayerToOpen === 'mxplayer') {
      // Open MX Player
      await SendIntentAndroid.isAppInstalled('com.mxtech.videoplayer.ad').then(
        async isInstalled => {
          if (isInstalled) {
            await SendIntentAndroid.openAppWithData(
              'com.mxtech.videoplayer.ad',
              media.url,
              'video/*',
              {
                title: item.name + ' - ' + item.media[index].name,
                headers: JSON.stringify(media.headers),
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
                    await Linking.openURL(
                      'market://details?id=com.mxtech.videoplayer.ad',
                    );
                  },
                },
              ],
            );
          }
        },
      );
    } else {
      // Web Video Cast
      await SendIntentAndroid.isAppInstalled(
        'com.instantbits.cast.webvideo',
      ).then(async isInstalled => {
        if (isInstalled) {
          await SendIntentAndroid.openAppWithData(
            'com.instantbits.cast.webvideo',
            media.url,
            'video/*',
            {
              title: item.name + ' - ' + item.media[index].name,
              headers: JSON.stringify(media.headers),
            },
          );
        } else {
          Alert.alert(
            'Web Video Cast is not installed, would you like to install it?',
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
                  await Linking.openURL(
                    'market://details?id=com.instantbits.cast.webvideo',
                  );
                },
              },
            ],
          );
        }
      });
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: scrollOffset,
        left: 0,
        right: 0,
        bottom: paddingToAddBottomSheet,
        zIndex: 10,
      }}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['50%']}
        handleStyle={{backgroundColor: theme.colors.surface}}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        onClose={() => {
          setVisible(false);
          setExtracting(false);
          setNoSources(false);
          setRawSources([]);
          setSources([]);
        }}
        style={styles.bottomSheetWrapper}>
        <BottomSheetView
          style={{
            ...styles.bottomSheetOptions,
            backgroundColor: theme.colors.surface,
          }}>
          {sources.length < 1 ? (
            noSources ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>No Sources Found</Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" />
              </View>
            )
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              {sources.map((source, sourceIndex) => (
                <List.Item
                  key={sourceIndex}
                  title={source.name}
                  left={(props: any) =>
                    source.iconUrl ? (
                      <Image source={{uri: source.iconUrl}} {...props} />
                    ) : (
                      <LazyImage
                        placeholderSource="square"
                        style={{borderRadius: 4}}
                      />
                    )
                  }
                  onPress={() => {
                    openMedia(source, detailedItem, index);
                  }}
                />
              ))}
            </ScrollView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default ExtractorSourcesBottomSheet;

const styles = StyleSheet.create({
  bottomSheetWrapper: {},
  bottomSheetOptions: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginVertical: '1.5%',
  },
});
