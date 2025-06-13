import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CategorySwiperItem from './CategorySwiperItem';
import {Plugin} from '../../../../plugins/domain/entities/Plugin';
import {useSearchPageDataStore} from '../../state/useSearchPageDataStore';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {SearchViewModel} from '../../viewmodels/SearchViewModel';

const PaginationBottomSheet = ({
  // getNextPage,
  // page,
  bottomSheetRef,
}: // scrollOffset,
// contentHeight,
{
  // getNextPage: (page: number) => Promise<void>;
  // page: number;
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  // scrollOffset: number;
  // contentHeight: number;
}) => {
  const searchViewModel = new SearchViewModel();

  const {
    bottomSheetActivePlugin,
    bottomSheetItems,
    setBottomSheetItems,
    setBottomSheetVisible,
  } = useSearchPageDataStore();

  useEffect(() => {
    setBottomSheetItems([]);
    (async () => {
      if (!bottomSheetActivePlugin) return;
      await searchViewModel.getNextPage(1, bottomSheetActivePlugin);
    })();
  }, []);

  const [nextPageNumber, setNextPageNumber] = useState(2);

  const [isAtBottom, setIsAtBottom] = useState(false);

  const onScrollToBottom = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  const onMomentumScrollEnd = () => {
    if (isAtBottom) {
      (async () => {
        await searchViewModel.getNextPage(
          nextPageNumber,
          bottomSheetActivePlugin!,
        );
        setNextPageNumber(nextPageNumber + 1);
      })();
    }
  };

  const theme = useTheme();

  // const paddingToAddBottomSheet =
  //   contentHeight -
  //   scrollOffset -
  //   Dimensions.get('screen').height +
  //   (Dimensions.get('screen').height - Dimensions.get('window').height) +
  //   (StatusBar.currentHeight || 24) +
  //   160;

  return (
    // <GestureHandlerRootView
    //   style={{
    //     flex: 1,
    //     // backgroundColor: 'transparent',
    //     // position: 'absolute',
    //     // top: scrollOffset,
    //     // left: 0,
    //     // right: 0,
    //     // bottom: paddingToAddBottomSheet,
    //     // zIndex: 10,
    //   }}>
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={['25%', '50%', '75%']}
      handleStyle={{backgroundColor: theme.colors.surface}}
      enablePanDownToClose={true}
      enableDynamicSizing={true}
      onClose={() => {
        setBottomSheetVisible(false);
      }}
      // style={{
      //   ...styles.bottomSheetWrapper,
      //   backgroundColor: theme.colors.surface,
      // }}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
      }}>
      <BottomSheetScrollView
        onScroll={onScrollToBottom}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            ...styles.container,
            backgroundColor: theme.colors.surface,
          }}>
          {bottomSheetItems.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <CategorySwiperItem
                item={{...item, source: bottomSheetActivePlugin}}
              />
            </View>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
    // </GestureHandlerRootView>
  );
};

export default PaginationBottomSheet;

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    paddingBottom: 20,
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
