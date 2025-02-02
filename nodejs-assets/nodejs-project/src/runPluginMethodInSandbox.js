"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PluginLoader_1 = __importDefault(require("./PluginLoader"));
function runPluginMethodInSandbox(pluginPath, methodToRun, args) {
    return __awaiter(this, void 0, void 0, function* () {
        // Dynamically load the plugin
        const pluginLoader = new PluginLoader_1.default(pluginPath);
        const contentServiceClass = pluginLoader.loadPlugin();
        // Get list of methods in content service
        const methods = Object.keys(contentServiceClass);
        // Check if the method exists and run it, otherwise return null
        if (methods.includes(methodToRun)) {
            const result = yield contentServiceClass[methodToRun](...args);
            return result;
        }
        else {
            throw new Error('Method not found');
        }
    });
}
exports.default = runPluginMethodInSandbox;
