import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  Icon,
  Text,
  TouchableRipple,
  Button,
  useTheme,
} from 'react-native-paper';
import Category from '../../../plugins/data/model/item/Category';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface FeaturedItemSwiperProps {
  category: Category;
}

const FeaturedItemSwiper = ({category}: FeaturedItemSwiperProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={category.items}
        renderItem={({item}) => (
          <View style={{flex: 1}}>
            <ImageBackground
              source={{uri: item.imageUrl}} // Replace with your image URL
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                height: '100%',
              }}
              resizeMode="cover">
              <View style={styles.gradientContainer}>
                <LinearGradient
                  colors={['#000', 'transparent']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  style={styles.gradient}
                />
              </View>
              <View style={styles.itemInfo}>
                <Text variant="titleLarge" style={{color: 'white'}}>
                  {item.name}
                </Text>
                <Text variant="bodyMedium" style={{color: 'white'}}>
                  {item.type.toString()}
                </Text>
                {item.description && (
                  <Text variant="bodyMedium" style={{color: 'white'}}>
                    {item.description}
                  </Text>
                )}
              </View>
            </ImageBackground>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="normal"
        snapToInterval={Dimensions.get('window').width}
        disableIntervalMomentum
        style={styles.flatList}
      />
      <View style={styles.buttonContainer}>
        <TouchableRipple
          onPress={() => {}}
          rippleColor={'rgba(255, 255, 255, 0.1)'}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}>
          <View style={styles.button}>
            <Icon source="plus" size={24} color="#fff" />
            <Text style={{color: '#fff'}}>Add</Text>
          </View>
        </TouchableRipple>
        <TouchableOpacity onPress={() => {}}>
          <Button
            icon={'play'}
            mode="contained"
            textColor="#000"
            style={{
              width: 120,
              height: 48,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              alignSelf: 'flex-start',
            }}>
            Play
          </Button>
        </TouchableOpacity>
        <TouchableRipple
          onPress={() => {}}
          rippleColor={'rgba(255, 255, 255, 0.1)'}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}>
          <View style={styles.button}>
            <Icon source="information-outline" size={24} color="#fff" />
            <Text style={{color: '#fff'}}>Info</Text>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 2,
    position: 'relative',
  },
  itemInfo: {
    width: '90%',
    marginLeft: '5%',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
    maxHeight: Dimensions.get('screen').height / 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    zIndex: 2,
  },
  button: {
    flexDirection: 'column',
    gap: 4,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  gradient: {
    height: '100%',
  },
});

export default FeaturedItemSwiper;
