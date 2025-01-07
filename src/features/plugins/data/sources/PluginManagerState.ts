import { Plugin } from "../../domain/entities/Plugin";

import { create } from "zustand";

interface PluginManagerState {
  plugins: Plugin[];
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginName: string) => void;
  getPlugin: (pluginName: string) => Plugin | undefined;
}

export const usePluginManager = create<PluginManagerState>((set, get) => ({
  plugins: [],
  registerPlugin: (plugin) =>
    set((state) => ({
      plugins: [...state.plugins, plugin],
    })),
  unregisterPlugin: (pluginName) =>
    set((state) => ({
      plugins: state.plugins.filter((p) => p.name !== pluginName),
    })),
  getPlugin: (pluginName) =>
    get().plugins.find((plugin) => plugin.name === pluginName),
}));
