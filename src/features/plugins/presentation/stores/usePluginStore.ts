import {Plugin} from '../../domain/entities/Plugin';

import {create} from 'zustand';

// Plugin store
// This store is used to store the plugins.
// Will be used by the plugin viewmodels.
// Also has CRUD methods for plugins.
// TODO: implement usecases
// TODO: persist plugins
interface PluginStoreState {
  permissionsGranted: boolean;
  onPermissionsGranted: () => void;
  onPermissionsDenied: () => void;
  plugins: Plugin[];
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginName: string) => void;
  getPlugin: (pluginName: string) => Plugin | undefined;
  getPlugins: () => Plugin[];
}

export const usePluginStore = create<PluginStoreState>((set, get) => ({
  permissionsGranted: false,
  onPermissionsGranted: () => set({permissionsGranted: true}),
  onPermissionsDenied: () => set({permissionsGranted: false}),
  plugins: [],
  registerPlugin: plugin =>
    set(state => ({
      plugins: [...state.plugins, plugin],
    })),
  unregisterPlugin: pluginName =>
    set(state => ({
      plugins: state.plugins.filter(p => p.name !== pluginName),
    })),
  getPlugin: pluginName =>
    get().plugins.find(plugin => plugin.name === pluginName),
  getPlugins: () => get().plugins,
}));
