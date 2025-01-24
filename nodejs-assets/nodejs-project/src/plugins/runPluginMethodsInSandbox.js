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
function runPluginMethodsInSandbox(pluginObject, methodToRun, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const pluginLoader = new PluginLoader_1.default(pluginObject);
        try {
            // Dynamically load the plugin
            const contentService = pluginLoader.loadPlugin();
            // Run a search
            // await pluginLoader.runSearch('example query');
            // Get list of methods in content service
            const methods = Object.keys(contentService);
            // Run the method
            if (methods.includes(methodToRun)) {
                const result = yield eval(`contentService.${methodToRun}(${args.join(', ')})`);
                console.log(result);
                return result;
            }
            else {
                console.log(`Method ${methodToRun} not found in plugin ${pluginObject.name}`);
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            return null;
        }
    });
}
exports.default = runPluginMethodsInSandbox;
