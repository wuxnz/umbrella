import ContentService from './models/ContentService';
import Category from './models/item/Category';
import DetailedItem from './models/item/DetailedItem';
import vm from 'vm';
import fs from 'fs';
import RawVideo from './models/media/RawVideo';
import RawAudio from './models/media/RawAudio';
import ExtractorVideo from './models/media/ExtractorVideo';
import ExtractorAudio from './models/media/ExtractorAudio';

export class PluginLoader {
  private pluginPath: string;

  constructor(pluginPath: string) {
    this.pluginPath = pluginPath;
  }

  loadPlugin(): ContentService {
    // Initialize React Native compatible modules with error handling
    let CryptoJS: any = null;
    let Cheerio: any = null;

    try {
      CryptoJS = require('react-native-crypto-js');
      console.log('React Native CryptoJS loaded successfully');
    } catch (err) {
      console.error('Failed to load react-native-crypto-js:', err);
    }

    try {
      Cheerio = require('react-native-cheerio');
      console.log('React Native Cheerio loaded successfully');
    } catch (err) {
      console.error('Failed to load react-native-cheerio:', err);
    }

    // Create sandbox with React Native compatible modules
    const sandbox: any = {
      console,
      fetch,
      require, // Basic Node.js require for built-in modules like 'buffer'
      Buffer: require('buffer').Buffer, // Add Buffer from Node.js buffer module
      CryptoJS, // React Native compatible CryptoJS
      Cheerio, // React Native compatible Cheerio
      exports: {},
      module: {exports: {}},
    };

    // Load and execute the plugin
    try {
      const pluginCode = fs.readFileSync(this.pluginPath, 'utf-8');
      const script = new vm.Script(pluginCode);
      const context = vm.createContext(sandbox);
      script.runInContext(context);
    } catch (error) {
      console.error('Error loading plugin:', error);
      throw error;
    }

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
      getItemMedia(
        id: string,
      ): Promise<(RawAudio | ExtractorAudio | RawVideo | ExtractorVideo)[]> {
        return pluginInstance.getItemMedia(id);
      },
    } as ContentService;

    // Return the content service
    return contentService;
  }
}

export default PluginLoader;
