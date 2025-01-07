import { Plugin } from "../entities/Plugin";

export interface PluginRepository {
  plugins: Plugin[];
  loadPlugin(url: string): Promise<string>;
  registerPlugin(plugin: Plugin): void;
  getPlugins(): Plugin[];
}
