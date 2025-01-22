import {create} from 'zustand';
import Source from '../../data/models/source/Source';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {DeleteManifestFileUsecase} from '../../domain/usecases/DeleteManifestFileUsecase';

const deleteManifestFileUsecase = new DeleteManifestFileUsecase(
  new PluginRepositoryImpl(),
);

interface InstallPluginDialogStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  source: Source;
  setSource: (source: Source) => void;
  deleteManifestFile: () => void;
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
      deleteManifestFileUsecase.execute(get().source);
      set({visible: false});
      set({source: {} as Source});
    },
  }));
