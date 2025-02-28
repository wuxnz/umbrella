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
const runPluginMethodInSandbox_1 = __importDefault(require("./src/runPluginMethodInSandbox"));
var rn_bridge = require('rn-bridge');
// Run plugin sandbox if the message is a plugin message, and if not, echo the message.
rn_bridge.channel.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if message is a regular message or a plugin message
    var messageJson;
    messageJson = JSON.parse(message);
    if (Object.keys(messageJson).length !== 3) {
        return;
    }
    const { pluginPath, methodToRun, args } = messageJson;
    // Run the method
    try {
        const result = yield (0, runPluginMethodInSandbox_1.default)(pluginPath, methodToRun, args);
        // Send the result
        rn_bridge.channel.send(JSON.stringify({ status: 'success', data: result }));
    }
    catch (error) {
        // Send the error message if any
        rn_bridge.channel.send(JSON.stringify({ status: 'error', error: error.message }));
    }
}));
// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized.');
