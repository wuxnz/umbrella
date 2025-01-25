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
    loadPlugin() {
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
            module: { exports: {} },
        };
        if (!this.pluginPath) {
            throw new Error('Invalid plugin: missing contentService.');
        }
        const pluginCode = fs_1.default.readFileSync(this.pluginPath, 'utf-8');
        const script = new vm_1.default.Script(pluginCode);
        const context = vm_1.default.createContext(sandbox);
        script.runInContext(context);
        const pluginInstance = sandbox.module.exports;
        rn_bridge.channel.send('pluginInstance type in PluginLoader: ' + typeof pluginInstance);
        rn_bridge.channel.send('pluginInstance in PluginLoader: ' + pluginInstance);
        // Run the script and retrieve the exported plugin
        // script.runInContext(context);
        // const contentService = pluginInstance as ContentService;
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
        rn_bridge.channel.send('contentService type in PluginLoader: ' + typeof contentService);
        rn_bridge.channel.send('contentService in PluginLoader: ' + contentService);
        // Validate the plugin
        // if (!this.contentService.name || Object.keys(this.contentService).length === 0) {
        //   throw new Error('Invalid plugin: missing required properties.');
        // }
        if (!contentService.search) {
            rn_bridge.channel.send('contentService.search missing in type in PluginLoader: ' +
                typeof contentService);
            throw new Error('Invalid plugin: missing required properties.');
        }
        // this.contentService.contentService = contentService;
        // console.log(`Plugin ${this.contentService.name} loaded successfully!`);
        return contentService;
    }
}
exports.PluginLoader = PluginLoader;
exports.default = PluginLoader;
