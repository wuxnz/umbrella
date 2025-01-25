import ContentService from './models/ContentService';
import Category from './models/item/Category';
import DetailedItem from './models/item/DetailedItem';
import vm from 'vm';
import fs from 'fs';

const rn_bridge = require('rn-bridge');

export class PluginLoader {
  private pluginPath: string;

  constructor(pluginPath: string) {
    this.pluginPath = pluginPath;
  }

  loadPlugin(): ContentService {
    // Create a new sandbox
    const sandbox = {
      require,
      console,
      BeautifulSoup: require('beautiful-soup-js'),
      // CryptoJS: require('crypto-js'),
      fetch,
      exports: {},
      module: {exports: {}},
    };

    // Load and execute the plugin
    if (!this.pluginPath) {
      throw new Error('Invalid plugin: missing contentService.');
    }

    const pluginCode = fs.readFileSync(this.pluginPath, 'utf-8');

    const script = new vm.Script(pluginCode);
    const context = vm.createContext(sandbox);

    script.runInContext(context);

    // Get the plugin instance
    const pluginInstance: any = sandbox.module.exports;

    // Create the content service
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

    // Return the content service
    return contentService;
  }
}

export default PluginLoader;
