import { usePluginManager } from "../../data/sources/PluginManagerState";
import { Plugin } from "../entities/Plugin";

export class LoadPlugin {
  constructor(private url: string) {}

  async execute(): Promise<string> {
    try {
      const pluginModule = await import(/* webpackIgnore: true */ this.url);
      const plugin: Plugin = pluginModule.default;
      plugin.initialize();
      usePluginManager.getState().registerPlugin(plugin);
      return Promise.resolve(`Plugin  ${plugin.name} loaded successfully.`);
    } catch (error: any) {
      return Promise.reject("Error loading plugin: " + error.message);
    }
  }
}
