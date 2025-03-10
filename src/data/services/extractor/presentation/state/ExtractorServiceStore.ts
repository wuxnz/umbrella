import {create} from 'zustand';
import RawAudio from '../../../../../features/plugins/data/model/media/RawAudio';
import RawVideo from '../../../../../features/plugins/data/model/media/RawVideo';
import ExtractorAudio from '../../../../../features/plugins/data/model/media/ExtractorAudio';
import ExtractorVideo from '../../../../../features/plugins/data/model/media/ExtractorVideo';

interface ExtractorServiceState {
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
