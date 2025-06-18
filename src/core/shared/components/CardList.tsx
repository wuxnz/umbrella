import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Card, CardProps} from 'react-native-paper';
import Item from '../../../features/plugins/data/model/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Favorite} from '../../../features/library/domain/entities/Favorite';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  details: {
    item: Item;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CardListProps
  extends Omit<CardProps, 'onPress' | 'style' | 'children'> {
  item: Favorite | Item;
  navigation: NavigationProp;
  onPress?: () => void;
  style?: CardProps['style'];
}
const CardList: React.FC<CardListProps> = ({
  item,
  navigation,
  onPress,
  style,
  ...props
}) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('details', {item: 'item' in item ? item.item : item});
    }
  };

  const cardStyle = [styles.card, style];

  return (
    <Card style={cardStyle} onPress={handlePress} {...props}>
      <Card.Cover
        source={
          showPlaceholder
            ? require('../../../../assets/images/placeholders/tall.jpg')
            : {uri: 'item' in item ? item.item.imageUrl : item.imageUrl}
        }
        onError={() => setShowPlaceholder(true)}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0.3}}
        style={styles.gradient}
      />
      <Card.Title
        title={'item' in item ? item.item.name : item.name}
        titleStyle={styles.cardTitle}
        titleNumberOfLines={2}
        style={styles.cardTitleContainer}
      />
    </Card>
  );
};

export default CardList;

const styles = StyleSheet.create({
  card: {
    marginRight: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
