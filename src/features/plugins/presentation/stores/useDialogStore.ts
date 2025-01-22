import {create} from 'zustand';
import Source from '../../data/models/source/Source';

interface DialogStoreState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: Source;
  setSource: (source: Source) => void;
}

export const useDialogStore = create<DialogStoreState>((set, get) => ({
  visible: false,
  setVisible: visible => set({visible}),
  source: {} as Source,
  setSource: source => set({source}),
}));
