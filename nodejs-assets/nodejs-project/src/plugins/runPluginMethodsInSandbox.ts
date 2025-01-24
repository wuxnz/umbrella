import ContentService from '../models/ContentService';
import {Plugin} from '../models/Plugin';
import PluginLoader from './PluginLoader';

async function runPluginMethodsInSandbox(
  pluginObject: Plugin,
  methodToRun: string,
  args: any[],
): Promise<any> {
  const pluginLoader = new PluginLoader(pluginObject);

  try {
    // Dynamically load the plugin
    const contentService: ContentService = pluginLoader.loadPlugin();

    // Run a search
    // await pluginLoader.runSearch('example query');

    // Get list of methods in content service
    const methods = Object.keys(contentService);

    // Run the method
    if (methods.includes(methodToRun)) {
      const result = await eval(
        `contentService.${methodToRun}(${args.join(', ')})`,
      );
      console.log(result);
      return result;
    } else {
      console.log(
        `Method ${methodToRun} not found in plugin ${pluginObject.name}`,
      );
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default runPluginMethodsInSandbox;
