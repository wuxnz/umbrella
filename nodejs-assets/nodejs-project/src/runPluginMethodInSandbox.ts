import ContentService from './models/ContentService';
import PluginLoader from './PluginLoader';

async function runPluginMethodInSandbox(
  pluginPath: string,
  methodToRun: string,
  args: any[],
): Promise<any> {
  // Dynamically load the plugin
  const pluginLoader = new PluginLoader(pluginPath);
  const contentServiceClass: ContentService = pluginLoader.loadPlugin();

  // Get list of methods in content service
  const methods = Object.keys(contentServiceClass);

  // Check if the method exists and run it, otherwise return null
  if (methods.includes(methodToRun)) {
    const result = await contentServiceClass[methodToRun](...args);
    return result;
  } else {
    throw new Error('Method not found');
  }
}

export default runPluginMethodInSandbox;
