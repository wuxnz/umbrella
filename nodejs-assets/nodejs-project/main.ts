// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

import {Plugin} from './src/models/Plugin';
import runPluginMethodsInSandbox from './src/plugins/runPluginMethodsInSandbox';

var rn_bridge = require('rn-bridge');

// Echo every message received from react-native.
// rn_bridge.channel.on('message', (msg: any) => {
//   rn_bridge.channel.send(msg);
// });

// Run plugin sandbox

rn_bridge.channel.on('message', async (message: any) => {
  try {
    const {pluginObject, methodToRun, args} = JSON.parse(message);
    try {
      const result = await runPluginMethodsInSandbox(
        pluginObject as Plugin,
        methodToRun as string,
        args as any[],
      );
      rn_bridge.channel.send(JSON.stringify({success: true, result}));
    } catch (error: any) {
      rn_bridge.channel.send(
        JSON.stringify({success: false, error: error.message}),
      );
    }
  } catch (error) {
    rn_bridge.channel.send('Invalid message');
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized.');
