import {create} from 'zustand';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';
import {Plugin} from '../../domain/entities/Plugin';

const deletePlugin = new DeletePluginUsecase(new PluginRepositoryImpl());

// Install plugin dialog store
// This store is used to display a dialog that asks the user to install a plugin
interface InstallPluginDialogStoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  plugin: Plugin;
  setPlugin: (plugin: Plugin) => void;
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
    plugin: {} as Plugin,
    setPlugin: plugin => set({plugin: plugin}),
    deleteManifestFile: () => {
      deletePlugin.execute(get().plugin);
      set({visible: false});
      set({plugin: {} as Plugin});
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
