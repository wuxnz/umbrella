import ContentService from '../models/ContentService';
import {Plugin} from '../models/Plugin';
import PluginLoader from './PluginLoader';

async function runPluginMethodInSandbox(
  contentService: string,
  methodToRun: string,
  args: any[],
): Promise<any> {
  const rn_bridge = require('rn-bridge');
  const pluginLoader = new PluginLoader(contentService);

  // try {
  // Dynamically load the plugin
  const contentServiceClass: ContentService = pluginLoader.loadPlugin();

  console.log(
    'runPluginMethodInSandbox - Content Service: ' + contentServiceClass,
  );
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
    const result = await contentServiceClass.search('example query');
    console.log('Eval Result: ' + result);
    // rn_bridge.channel.send('Eval Result: ' + result);
    return result;
    // return null;
  } else {
    // rn_bridge.channel.send(
    //   `Method ${methodToRun} not found in plugin ${methodToRun}`,
    // );
    return null;
  }
  // } catch (error) {
  //   // rn_bridge.channel.send('Error:', error.message);
  //   return null;
  // }
}

export default runPluginMethodInSandbox;
