import {ScrollView, View, StyleSheet, Dimensions} from 'react-native';
import FeaturedItemSwiper from './presentation/components/FeaturedItemSwiper'; // Import MovieSwiper
import SourceType from '../plugins/data/model/source/SourceType'; // Import SourceType

import React, {useRef} from 'react';
import CategorySwiper from '../search/presentation/components/CategorySwiper/CategorySwiper';
import BottomSheet from '@gorhom/bottom-sheet';
import {Plugin} from '../plugins/domain/entities/Plugin';
import {FAB, useTheme} from 'react-native-paper';

const HomeNavigator = () => {
  const mockCategory = {
    // Create a mock category object
    name: 'Popular Movies',
    description: 'A list of popular movies',
    url: 'http://example.com/popular',
    isPaginated: false,
    items: [
      {
        id: '1',
        name: 'Movie 1',
        imageUrl:
          'https://gogoanime.by/wp-content/uploads/2025/01/a-rank-party-wo-ridatsu-shita-ore-wa-moto-oshiego-tachi-to-meikyuu-shinbu-wo-mezasu.webp',
        url: 'http://example.com/movie1',
        type: SourceType.Video,
      },
      {
        id: '2',
        name: 'Movie 2',
        imageUrl:
          'https://gogoanime.by/wp-content/uploads/2025/01/a-rank-party-wo-ridatsu-shita-ore-wa-moto-oshiego-tachi-to-meikyuu-shinbu-wo-mezasu.webp',
        url: 'http://example.com/movie2',
        type: SourceType.Video,
      },
      {
        id: '3',
        name: 'Movie 3',
        imageUrl:
          'https://gogoanime.by/wp-content/uploads/2025/01/a-rank-party-wo-ridatsu-shita-ore-wa-moto-oshiego-tachi-to-meikyuu-shinbu-wo-mezasu.webp',
        url: 'http://example.com/movie3',
        type: SourceType.Video,
      },
    ],
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}>
        <FeaturedItemSwiper category={mockCategory} />
        <View
          style={{
            flexDirection: 'column',
            gap: 24,
            padding: 16,
          }}>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <CategorySwiper
                key={index}
                category={mockCategory}
                bottomSheetRef={bottomSheetRef}
                plugin={{} as Plugin}
              />
            ))}
        </View>
      </ScrollView>
      <FAB
        icon="filter-variant"
        label="Gogoanime"
        color={theme.colors.onSurface}
        style={{
          backgroundColor: theme.colors.surface,
          position: 'absolute',
          bottom: 8,
          right: 8,
        }}
        onPress={() => console.log('Gogoanime')}
      />
    </View>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
