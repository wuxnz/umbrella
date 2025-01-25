import runPluginMethodInSandbox from './src/runPluginMethodInSandbox';

var rn_bridge = require('rn-bridge');

// Run plugin sandbox if the message is a plugin message, and if not, echo the message.
rn_bridge.channel.on('message', async (message: any) => {
  // Check if message is a regular message or a plugin message
  var messageJson;
  messageJson = JSON.parse(message);
  if (Object.keys(messageJson).length !== 3) {
    rn_bridge.channel.send(message);
    return;
  }
  console.log(messageJson);
  const {pluginPath, methodToRun, args} = messageJson;

  // Run the method
  try {
    const result = await runPluginMethodInSandbox(
      pluginPath,
      methodToRun,
      args,
    );

    // Send the result
    rn_bridge.channel.send(JSON.stringify({success: true, data: result}));
  } catch (error: any) {
    // Send the error message if any
    rn_bridge.channel.send('Error: ' + error.message);
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send('Node was initialized and changed.');
