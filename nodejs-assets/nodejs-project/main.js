"use strict";
// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.
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
const runPluginMethodInSandbox_1 = __importDefault(require("./src/plugins/runPluginMethodInSandbox"));
var rn_bridge = require('rn-bridge');
// Echo every message received from react-native.
// rn_bridge.channel.on('message', (msg: any) => {
//   rn_bridge.channel.send(msg);
// });
// if (typeof runPluginMethodInSandbox !== 'function') {
//   rn_bridge.channel.send('Invalid runPluginMethodInSandbox');
// } else {
//   rn_bridge.channel.send('runPluginMethodInSandbox', runPluginMethodInSandbox);
// }
// Run plugin sandbox
rn_bridge.channel.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    var messageJson;
    // try {
    messageJson = JSON.parse(message);
    // } catch (error) {
    //   rn_bridge.channel.send('Invalid message');
    //   return;
    // }
    if (Object.keys(messageJson).length !== 3) {
        return;
    }
    console.log(messageJson);
    // rn_bridge.channel.send('Received message: ' + messageJson);
    // rn_bridge.channel.send('typeof message: ' + typeof messageJson);
    const { pluginPath, methodToRun, args } = messageJson;
    // rn_bridge.channel.send(JSON.stringify({contentService, methodToRun, args}));
    // console.log(contentService, methodToRun, args);
    // if (
    //   typeof contentService !== 'string' ||
    //   typeof methodToRun !== 'string' ||
    //   !Array.isArray(args)
    // ) {
    //   throw new Error('Invalid message');
    // }
    // console.log(runPluginMethodInSandbox);
    try {
        const result = yield (0, runPluginMethodInSandbox_1.default)(pluginPath, methodToRun, args);
        // rn_bridge.channel.send('Result: ' + result);
        console.log(result);
        // const result = null;
        rn_bridge.channel.send(JSON.stringify({ success: true, data: result }));
        // } catch (error: any) {
        //   console.log(error);
        // rn_bridge.channel.send(
        //   JSON.stringify({success: false, error: error.message}),
        // );
        // }
    }
    catch (error) {
        rn_bridge.channel.send('Error: ' + error);
    }
}));
// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized and changed.');
