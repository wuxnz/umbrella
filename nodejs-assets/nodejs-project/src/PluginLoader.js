"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoader = void 0;
const vm_1 = __importDefault(require("vm"));
const fs_1 = __importDefault(require("fs"));
const rn_bridge = require('rn-bridge');
class PluginLoader {
    constructor(pluginPath) {
        this.pluginPath = pluginPath;
    }
    loadPlugin() {
        // Create a new sandbox
        const sandbox = {
            require,
            console,
            BeautifulSoup: require('beautiful-soup-js'),
            // CryptoJS: require('crypto-js'),
            fetch,
            exports: {},
            module: { exports: {} },
        };
        // Load and execute the plugin
        if (!this.pluginPath) {
            throw new Error('Invalid plugin: missing contentService.');
        }
        const pluginCode = fs_1.default.readFileSync(this.pluginPath, 'utf-8');
        const script = new vm_1.default.Script(pluginCode);
        const context = vm_1.default.createContext(sandbox);
        script.runInContext(context);
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
        };
        // Return the content service
        return contentService;
    }
}
exports.PluginLoader = PluginLoader;
exports.default = PluginLoader;
