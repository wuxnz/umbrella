import {create} from 'zustand';
import Source from '../../data/models/source/Source';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';

const deletePlugin = new DeletePluginUsecase(new PluginRepositoryImpl());

// Install plugin dialog store
// This store is used to display a dialog that asks the user to install a plugin
interface InstallPluginDialogStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: Source;
  setSource: (source: Source) => void;
  deleteManifestFile: () => void;
  onConfirm: () => Promise<void>;
  setOnConfirm: (onConfirm: () => void) => void;
}

export const useInstallPluginDialogStore =
  create<InstallPluginDialogStoreState>((set, get) => ({
    loading: false,
    setLoading: loading => set({loading}),
    visible: false,
    setVisible: visible => set({visible}),
    source: {} as Source,
    setSource: source => set({source}),
    deleteManifestFile: () => {
      deletePlugin.execute(get().source);
      set({visible: false});
      set({source: {} as Source});
    },
    onConfirm: async () => {
      return Promise.resolve();
    },
    setOnConfirm: onConfirm =>
      set({
        async onConfirm() {
          await onConfirm();
        },
      }),
  }));
