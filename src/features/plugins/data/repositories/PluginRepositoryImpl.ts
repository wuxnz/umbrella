import { Plugin } from "../../domain/entities/Plugin";
import { PluginRepository } from "../../domain/repositories/PluginRepository";

export class PluginRepositoryImpl implements PluginRepository {
  plugins: Plugin[] = [];

  async loadPlugin(url: string): Promise<string> {
    return fetch(url).then((res) => res.text());
  }

  registerPlugin(plugin: Plugin): void {
    if (!plugin.name || typeof plugin.initialize !== "function") {
      throw new Error("Invalid plugin");
    }
    this.plugins.push(plugin);
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }
}
