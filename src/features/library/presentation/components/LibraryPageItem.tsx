import React from 'react';
import Item from '../../../plugins/data/model/item/Item';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/core';
import {Favorite} from '../../domain/entities/Favorite';
import CardList from '../../../../core/shared/components/CardList';

type DetailsScreenProps = {
  details: {
    item: Item;
  };
};

const LibraryPageItem = ({item}: {item: Favorite}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DetailsScreenProps>>();


  return <CardList item={item} navigation={navigation}/>;
};

export default LibraryPageItem;