import {Plugin} from '../../domain/entities/Plugin';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persist, createJSONStorage} from 'zustand/middleware';
import {DeletePluginUsecase} from '../../domain/usecases/DeletePluginUsecase';
import {PluginRepositoryImpl} from '../../data/repositories/PluginRepositoryImpl';

const deletePlugin = new DeletePluginUsecase(new PluginRepositoryImpl());

// Plugin store
// This store is used to store the plugins.
// Will be used by the plugin viewmodels.
// Also has CRUD methods for plugins.
// TODO: implement usecases
// TODO: persist plugins
interface PluginStoreState {
  plugins: Plugin[];
  setPlugins: (plugins: Plugin[]) => void;
  permissionsGranted: boolean;
  onPermissionsGranted: () => void;
  onPermissionsDenied: () => void;
  registerPlugin: (plugin: Plugin) => void;
  deletePlugin: (plugin: Plugin) => void;
  getPlugin: (path: string) => Plugin | undefined;
  getPlugins: () => Plugin[];
}

export const usePluginStore = create(
  persist<PluginStoreState>(
    (set, get) => ({
      permissionsGranted: false,
      onPermissionsGranted: () => set({permissionsGranted: true}),
      onPermissionsDenied: () => set({permissionsGranted: false}),
      plugins: [],
      setPlugins: plugins => set({plugins}),
      registerPlugin: plugin =>
        set(state => ({
          plugins: [...state.plugins, plugin],
        })),
      deletePlugin: plugin => {
        deletePlugin.execute(plugin);
        set(state => ({
          plugins: state.plugins.filter(p => Object.is(p, plugin)),
        }));
      },
      getPlugin: path =>
        get().plugins.find(plugin => plugin.pluginPath === path),
      getPlugins: () => get().plugins,
    }),
    {
      name: 'plugins',
      storage: createJSONStorage(() => AsyncStorage),
      version: 0,
    },
  ),
);
