// src/PluginLoader.ts
import ContentService from '../models/ContentService';
import Category from '../models/item/Category';
import {Plugin} from '../models/Plugin';
import vm from 'vm';
import vm2 from 'vm2';

export class PluginLoader {
  private plugin: Plugin;

  constructor(private pluginObject: Plugin) {
    this.plugin = pluginObject;
  }

  loadPlugin(): ContentService {
    // const vm = require('vm');

    // Create a sandbox to execute the plugin
    const sandbox = {
      require,
      exports: {},
    };

    if (!this.plugin.contentServiceSource) {
      throw new Error('Invalid plugin: missing contentService.');
    }

    const script = new vm.Script(this.plugin.contentServiceSource);
    const context = vm.createContext(sandbox);

    // Run the script and retrieve the exported plugin
    script.runInContext(context);
    const contentService = sandbox.exports as ContentService;

    // Validate the plugin
    if (!this.plugin.name || Object.keys(this.plugin).length === 0) {
      throw new Error('Invalid plugin: missing required properties.');
    }

    this.plugin.contentService = contentService;
    console.log(`Plugin ${this.plugin.name} loaded successfully!`);

    return contentService;
  }

  // async runSearch(query: string, page?: number): Promise<void> {
  //   // for (const plugin of this.plugin) {
  //   //   console.log(`Running plugin: ${plugin.name}`);
  //   //   const result = await plugin.search(query);
  //   //   console.log(`Result from ${plugin.name}:`, result);
  //   // }

  //   if (!this.plugin.contentService) {
  //     throw new Error('Invalid plugin: missing contentService.');
  //   }

  //   console.log(`Running plugin: ${this.plugin.name}`);
  //   const result = await this.plugin.contentService.search(query);
  //   console.log(`Result from ${this.plugin.name}:`, result);
  //   // return result;
  // }
}

export default PluginLoader;
