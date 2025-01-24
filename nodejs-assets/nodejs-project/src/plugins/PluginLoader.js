"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoader = void 0;
const vm_1 = __importDefault(require("vm"));
class PluginLoader {
    constructor(pluginObject) {
        this.pluginObject = pluginObject;
        this.plugin = pluginObject;
    }
    loadPlugin() {
        // const vm = require('vm');
        // Create a sandbox to execute the plugin
        const sandbox = {
            require,
            exports: {},
        };
        if (!this.plugin.contentServiceSource) {
            throw new Error('Invalid plugin: missing contentService.');
        }
        const script = new vm_1.default.Script(this.plugin.contentServiceSource);
        const context = vm_1.default.createContext(sandbox);
        // Run the script and retrieve the exported plugin
        script.runInContext(context);
        const contentService = sandbox.exports;
        // Validate the plugin
        if (!this.plugin.name || Object.keys(this.plugin).length === 0) {
            throw new Error('Invalid plugin: missing required properties.');
        }
        this.plugin.contentService = contentService;
        console.log(`Plugin ${this.plugin.name} loaded successfully!`);
        return contentService;
    }
}
exports.PluginLoader = PluginLoader;
exports.default = PluginLoader;
