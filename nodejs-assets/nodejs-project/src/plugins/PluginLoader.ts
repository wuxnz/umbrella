// src/PluginLoader.ts
import ContentService from '../models/ContentService';
import Category from '../models/item/Category';
import DetailedItem from '../models/item/DetailedItem';
import {Plugin} from '../models/Plugin';
import vm from 'vm';
import vm2 from 'vm2';
import path from 'path';
import fs from 'fs';

const rn_bridge = require('rn-bridge');

export class PluginLoader {
  // private contentService: ContentService;
  private pluginPath: string;

  constructor(pluginPath: string) {
    // const contentServiceFunctions = eval(pluginPath);

    // const contentService = {
    //   search(query: string, page?: number): Promise<Category> {
    //     return contentServiceFunctions.search(query, page) as Promise<Category>;
    //   },
    //   getCategory(category: string, page?: number): Promise<Category> {
    //     return contentServiceFunctions.getCategory(category, page);
    //   },
    //   getHomeCategories(): Promise<Category[]> {
    //     return contentServiceFunctions.getHomeCategories() as Promise<
    //       Category[]
    //     >;
    //   },
    //   getItemDetails(id: string): Promise<DetailedItem> {
    //     return contentServiceFunctions.getItemDetails(id);
    //   },
    // } as ContentService;

    // this.contentService = contentService;

    this.pluginPath = pluginPath;
  }

  loadPlugin(): ContentService {
    // const vm = require('vm');

    // Create a sandbox to execute the plugin
    // const vm = new vm2.NodeVM({
    //   console: 'inherit',
    //   sandbox: {}, // Add custom objects if needed
    //   require: {
    //     external: true, // Allow specific packages
    //     root: path.resolve(__dirname, '../'),
    //   },
    // });

    const sandbox = {
      require,
      console,
      fetch,
      exports: {},
      module: {exports: {}},
    };

    if (!this.pluginPath) {
      throw new Error('Invalid plugin: missing contentService.');
    }

    const pluginCode = fs.readFileSync(this.pluginPath, 'utf-8');

    const script = new vm.Script(pluginCode);
    const context = vm.createContext(sandbox);

    script.runInContext(context);

    const pluginInstance: any = sandbox.module.exports;
    rn_bridge.channel.send(
      'pluginInstance type in PluginLoader: ' + typeof pluginInstance,
    );
    rn_bridge.channel.send('pluginInstance in PluginLoader: ' + pluginInstance);

    // Run the script and retrieve the exported plugin
    // script.runInContext(context);
    // const contentService = pluginInstance as ContentService;

    const contentService = {
      search(query: string, page?: number): Promise<Category> {
        return pluginInstance.search(query, page) as Promise<Category>;
      },
      getCategory(category: string, page?: number): Promise<Category> {
        return pluginInstance.getCategory(category, page);
      },
      getHomeCategories(): Promise<Category[]> {
        return pluginInstance.getHomeCategories() as Promise<Category[]>;
      },
      getItemDetails(id: string): Promise<DetailedItem> {
        return pluginInstance.getItemDetails(id);
      },
    } as ContentService;

    rn_bridge.channel.send(
      'contentService type in PluginLoader: ' + typeof contentService,
    );
    rn_bridge.channel.send('contentService in PluginLoader: ' + contentService);

    // Validate the plugin
    // if (!this.contentService.name || Object.keys(this.contentService).length === 0) {
    //   throw new Error('Invalid plugin: missing required properties.');
    // }

    if (!contentService.search) {
      rn_bridge.channel.send(
        'contentService.search missing in type in PluginLoader: ' +
          typeof contentService,
      );
      throw new Error('Invalid plugin: missing required properties.');
    }

    // this.contentService.contentService = contentService;
    // console.log(`Plugin ${this.contentService.name} loaded successfully!`);

    return contentService;
  }

  // async runSearch(query: string, page?: number): Promise<void> {
  //   // for (const plugin of this.contentService) {
  //   //   console.log(`Running plugin: ${plugin.name}`);
  //   //   const result = await plugin.search(query);
  //   //   console.log(`Result from ${plugin.name}:`, result);
  //   // }

  //   if (!this.contentService.contentService) {
  //     throw new Error('Invalid plugin: missing contentService.');
  //   }

  //   console.log(`Running plugin: ${this.contentService.name}`);
  //   const result = await this.contentService.contentService.search(query);
  //   console.log(`Result from ${this.contentService.name}:`, result);
  //   // return result;
  // }
}

export default PluginLoader;
