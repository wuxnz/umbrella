import Status from '../../../../core/shared/types/Status.js';
import Source from '../../data/models/source/Source';
import {usePluginManager} from '../../data/sources/PluginManagerState';
import {Plugin} from '../entities/Plugin';

export class LoadPlugin {
  constructor(private source: Source) {}

  async execute(): Promise<Status<any>> {
    try {
      // const pluginModule = await import(this.path);
      // const plugin: Plugin = pluginModule.default;
      // // plugin.initialize();
      // usePluginManager.getState().registerPlugin(plugin);
      // return Promise.resolve(`Plugin  ${plugin.name} loaded successfully.`);

      // const module = await import('./pa);
      // const classNames = Object.keys(module).filter(
      //   key => typeof module[key] === 'function' && module[key].prototype,
      // );
      // const contentServiceClass = classNames.find(className => {
      //   const classMethods = Object.getOwnPropertyNames(
      //     module[className].prototype,
      //   );
      //   const contentServiceMethods = ['method1', 'method2', 'method3']; // Define the methods of the ContentService interface
      //   return contentServiceMethods.every(method =>
      //     classMethods.includes(method),
      //   );
      // });
      // if (contentServiceClass) {
      //   return module[contentServiceClass];
      // } else {
      //   throw new Error('No class implements the ContentService interface');
      // }
      const status: Status<any> = {
        status: 'success',
        data: 'Plugin loaded successfully.',
      };
      return status;
    } catch (error: any) {
      return {
        status: 'error',
        error: error.message,
      };
    }
  }
}
