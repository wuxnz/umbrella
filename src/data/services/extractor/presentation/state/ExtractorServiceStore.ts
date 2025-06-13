import {create} from 'zustand';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';
import DetailedItem from '../../../../../features/plugins/data/model/item/DetailedItem';

interface ExtractorServiceState {
  detailedItem: DetailedItem;
  setDetailedItem: (item: DetailedItem) => void;
  mediaIndex: number;
  setMediaIndex: (index: number) => void;
  extracting: boolean;
  setExtracting: (value: boolean) => void;
  bottomSheetVisible: boolean;
  setBottomSheetVisible: (visible: boolean) => void;
  rawSources: (ExtractorAudio | RawAudio | ExtractorVideo | RawVideo)[];
  setRawSources: (
    sources: (ExtractorAudio | RawAudio | ExtractorVideo | RawVideo)[],
  ) => void;
  sources: (RawAudio | RawVideo)[];
  setSources: (sources: (RawAudio | RawVideo)[]) => void;
}

export const useExtractorServiceStore = create<ExtractorServiceState>()(
  set => ({
    detailedItem: {} as DetailedItem,
    setDetailedItem: (item: DetailedItem) => {
      set({
        detailedItem: item,
      });
    },
    mediaIndex: 0,
    setMediaIndex: (index: number) => {
      set({
        mediaIndex: index,
      });
    },
    extracting: false,
    setExtracting: value =>
      set(() => {
        return {extracting: value};
      }),
    bottomSheetVisible: false,
    setBottomSheetVisible: (visible: boolean) =>
      set({bottomSheetVisible: visible}),
    rawSources: [],
    setRawSources: (
      rawSources: (ExtractorAudio | RawAudio | ExtractorVideo | RawVideo)[],
    ) => set({rawSources}),
    sources: [],
    setSources: (sources: (RawAudio | RawVideo)[]) => set({sources}),
  }),
);
