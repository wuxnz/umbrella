'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
exports.PluginLoader = void 0;
const vm_1 = __importDefault(require('vm'));
const fs_1 = __importDefault(require('fs'));
class PluginLoader {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
  }
  loadPlugin() {
    // Initialize Node.js modules with error handling
    let CryptoJS = null;
    let Cheerio = null;
    try {
      CryptoJS = require('crypto-js');
      console.log('CryptoJS loaded successfully');
    } catch (err) {
      console.error('Failed to load crypto-js:', err);
    }
    try {
      Cheerio = require('cheerio');
      console.log('Cheerio loaded successfully');
    } catch (err) {
      console.error('Failed to load cheerio:', err);
    }
    // Create sandbox with Node.js modules
    const sandbox = {
      console,
      fetch,
      require, // Basic Node.js require for built-in modules like 'buffer'
      CryptoJS, // Regular CryptoJS
      Cheerio, // Regular Cheerio
      exports: {},
      builtin: ['*'],
      module: {exports: {}},
    };
    // Load and execute the plugin
    try {
      const pluginCode = fs_1.default.readFileSync(this.pluginPath, 'utf-8');
      const script = new vm_1.default.Script(pluginCode);
      const context = vm_1.default.createContext(sandbox);
      script.runInContext(context);
    } catch (error) {
      console.error('Error loading plugin:', error);
      throw error;
    }
    // Get the plugin instance
    const pluginInstance = sandbox.module.exports;
    // Create the content service
    const contentService = {
      search(query, page) {
        return pluginInstance.search(query, page);
      },
      getCategory(category, page) {
        return pluginInstance.getCategory(category, page);
      },
      getHomeCategories() {
        return pluginInstance.getHomeCategories();
      },
      getItemDetails(id) {
        return pluginInstance.getItemDetails(id);
      },
      getItemMedia(id) {
        return pluginInstance.getItemMedia(id);
      },
    };
    // Return the content service
    return contentService;
  }
}
exports.PluginLoader = PluginLoader;
exports.default = PluginLoader;
