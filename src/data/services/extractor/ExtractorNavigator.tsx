import {View, Text, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useExtractorServiceStore} from './presentation/state/ExtractorServiceStore';
import MediaType from '../../../features/plugins/data/model/media/MediaType';
import RawVideo from '../../../features/plugins/data/model/media/RawVideo';
import ExtractorVideo from '../../../features/plugins/data/model/media/ExtractorVideo';
import RawAudio from '../../../features/plugins/data/model/media/RawAudio';
import ExtractorAudio from '../../../features/plugins/data/model/media/ExtractorAudio';
import {ExtractorViewModel} from './presentation/viewmodels/ExtractorViewModel';
import ExtractorSourcesBottomSheet from './presentation/components/ExtractSourcesBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SendIntentAndroid from 'react-native-send-intent';
import DetailedItem from '../../../features/plugins/data/model/item/DetailedItem';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

const ExtractorNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text>Extractors Navigation Screen </Text>
    </View>
  );
};

export default ExtractorNavigator;
