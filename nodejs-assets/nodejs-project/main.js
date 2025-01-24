"use strict";
// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.
Object.defineProperty(exports, "__esModule", { value: true });
var rn_bridge = require('rn-bridge');
// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
    rn_bridge.channel.send(msg);
});
// Run plugin sandbox
// rn_bridge.channel.on('message', async (message: any) => {
//   const {pluginObject, methodToRun, args} = JSON.parse(message);
//   try {
//     const result = await runPluginMethodsInSandbox(
//       pluginObject as Plugin,
//       methodToRun as string,
//       args as any[],
//     );
//     channel.send(JSON.stringify({success: true, result}));
//   } catch (error: any) {
//     channel.send(JSON.stringify({success: false, error: error.message}));
//   }
// });
// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized.');
