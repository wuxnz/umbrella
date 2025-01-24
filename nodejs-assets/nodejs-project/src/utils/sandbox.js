// // utils/sandbox.js
// const {NodeVM} = require('vm2');
// const path = require('path');
// function runPluginSandbox(pluginPath, query) {
//   const vm = new NodeVM({
//     console: 'inherit',
//     sandbox: {}, // Add custom objects if needed
//     require: {
//       external: true, // Allow specific packages
//       root: path.resolve(__dirname, '../'),
//     },
//   });
//   // Load and execute the plugin
//   const PluginClass = vm.require(pluginPath);
//   const pluginInstance = new PluginClass();
//   // Validate the interface
//   const validatePlugin = require('./interfaceValidator');
//   validatePlugin(pluginInstance);
//   // Run the plugin's `search` method
//   return pluginInstance.search(query);
// }
// module.exports = runPluginSandbox;
