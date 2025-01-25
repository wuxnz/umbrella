// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

import {Plugin} from './src/models/Plugin';
import runPluginMethodInSandbox from './src/plugins/runPluginMethodInSandbox';

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

rn_bridge.channel.on('message', async (message: any) => {
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
  const {pluginPath, methodToRun, args} = messageJson;
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
    const result = await runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );
    // rn_bridge.channel.send('Result: ' + result);
    console.log(result);
    // const result = null;
    rn_bridge.channel.send(JSON.stringify({success: true, data: result}));
    // } catch (error: any) {
    //   console.log(error);
    // rn_bridge.channel.send(
    //   JSON.stringify({success: false, error: error.message}),
    // );
    // }
  } catch (error) {
    rn_bridge.channel.send('Error: ' + error);
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized and changed.');
