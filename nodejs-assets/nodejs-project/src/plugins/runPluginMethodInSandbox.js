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
function runPluginMethodInSandbox(contentService, methodToRun, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const rn_bridge = require('rn-bridge');
        const pluginLoader = new PluginLoader_1.default(contentService);
        // try {
        // Dynamically load the plugin
        const contentServiceClass = pluginLoader.loadPlugin();
        console.log('runPluginMethodInSandbox - Content Service: ' + contentServiceClass);
        // rn_bridge.channel.send(
        //   'runPluginMethodInSandbox - Content Service: ' + contentService,
        // );
        // Run a search
        // await pluginLoader.runSearch('example query');
        // Get list of methods in content service
        const methods = Object.keys(contentServiceClass);
        console.warn('runPluginMethodInSandbox - methods', methods);
        // rn_bridge.channel.send('runPluginMethodInSandbox - Methods: ' + methods);
        // Run the method
        if (methods.includes(methodToRun)) {
            // const result = await eval(
            //   `contentService.${methodToRun}(${args.join(', ')})`,
            // );
            const result = yield contentServiceClass.search('example query');
            console.log('Eval Result: ' + result);
            // rn_bridge.channel.send('Eval Result: ' + result);
            return result;
            // return null;
        }
        else {
            // rn_bridge.channel.send(
            //   `Method ${methodToRun} not found in plugin ${methodToRun}`,
            // );
            return null;
        }
        // } catch (error) {
        //   // rn_bridge.channel.send('Error:', error.message);
        //   return null;
        // }
    });
}
exports.default = runPluginMethodInSandbox;
