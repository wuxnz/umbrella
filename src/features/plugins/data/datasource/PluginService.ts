import Status from '../../../../core/shared/types/Status';
import constants from '../../../../core/utils/constants';
import {Plugin} from '../../domain/entities/Plugin';
import {toSourceType} from '../model/source/SourceType';
import * as RNFS from 'react-native-fs';
import Category from '../model/item/Category';
import DetailedItem from '../model/item/DetailedItem';
import nodejs from 'nodejs-mobile-react-native';
import {usePluginStore} from '../../presentation/state/usePluginStore';
import RawAudio from '../model/media/RawAudio';
import RawVideo from '../model/media/RawVideo';

// Plugin service
// This is the service that gets the data for the plugin
// Will be used by the plugin repository implementation
export const PluginService = {
  async fetchManifest(manifestUrl: string): Promise<Status<Plugin>> {
    const manifest = await fetch(manifestUrl);
    const manifestJson = await manifest.json();

    if (!manifest.ok) {
      return {
        status: 'error',
        error: manifest.statusText,
      };
    }

    const manifestPath =
      RNFS.ExternalStorageDirectoryPath +
      `/${constants.APP_NAME}/` +
      `${constants.PLUGIN_FOLDER_NAME}/${
        manifestJson.author
      }_${manifestJson.name.split(' ').join('_')}.json`;

    if (!(await RNFS.exists(manifestPath.split('/').slice(0, -1).join('/')))) {
      await RNFS.mkdir(manifestPath.split('/').slice(0, -1).join('/'));
    }

    await RNFS.downloadFile({
      fromUrl: manifestUrl,
      toFile: manifestPath,
    });

    return {
      status: 'success',
      data: {
        ...manifestJson,
        sourceType: toSourceType(manifestJson.sourceType),
        manifestPath: manifestPath,
      },
    };
  },
  async deletePlugin(manifest: Plugin): Promise<Status<void>> {
    if (!manifest.manifestPath || !manifest.pluginPath) {
      return {
        status: 'error',
        error: 'No manifest file path or plugin file path',
      };
    }

    await RNFS.unlink(manifest.manifestPath);
    await RNFS.unlink(manifest.pluginPath);

    return {
      status: 'success',
      data: undefined,
    };
  },
  async fetchPlugin(manifest: Plugin): Promise<Status<Plugin>> {
    if (!manifest.pluginUrl) {
      return {
        status: 'error',
        error: 'No plugin url',
      };
    }

    if (manifest.pluginUrl === undefined) {
      return {
        status: 'error',
        error: 'No plugin url',
      };
    }

    const pluginResponse = await fetch(manifest.pluginUrl);
    const pluginJS = await pluginResponse.text();

    if (!pluginResponse.ok) {
      return {
        status: 'error',
        error: pluginResponse.statusText,
      };
    }

    const pluginPath =
      RNFS.ExternalStorageDirectoryPath +
      `/${constants.APP_NAME}/` +
      `${constants.PLUGIN_FOLDER_NAME}/${manifest.author}_${manifest.name
        .split(' ')
        .join('_')}.js`;

    if (!(await RNFS.exists(pluginPath.split('/').slice(0, -1).join('/')))) {
      await RNFS.mkdir(pluginPath.split('/').slice(0, -1).join('/'));
    }

    await RNFS.writeFile(pluginPath, await pluginJS, 'utf8');

    const plugin: Plugin = {
      ...manifest,
      pluginPath: pluginPath,
      pluginUrl: manifest.pluginUrl,
    };

    return {
      status: 'success',
      data: plugin,
    };
  },
  async loadAllPluginsFromStorage(): Promise<Status<Plugin[]>> {
    var plugins: Plugin[] = [];

    const pluginFolderPath =
      RNFS.ExternalStorageDirectoryPath +
      `/${constants.APP_NAME}/` +
      `${constants.PLUGIN_FOLDER_NAME}`;

    if (!(await RNFS.exists(pluginFolderPath))) {
      return {
        status: 'error',
        error: 'No plugin folder found',
      };
    }

    const pluginsFolderFiles = await RNFS.readDir(pluginFolderPath);

    const manifestFiles = pluginsFolderFiles.filter(plugin =>
      plugin.name.endsWith('.json'),
    );

    const pluginFiles = pluginsFolderFiles.filter(
      plugin => !plugin.name.endsWith('.js'),
    );

    for (const manifestFile of manifestFiles) {
      const manifest = await RNFS.readFile(manifestFile.path, 'utf8');
      const manifestJson = JSON.parse(manifest) as Plugin;

      // Check if the manifest file is empty
      if (Object.keys(manifestJson).length === 0) {
        return {
          status: 'error',
          error: 'No plugin path found',
        };
      }

      const pluginCode = await RNFS.readFile(
        `${manifestFile.path.replace('.json', '.js')}`,
        'utf8',
      );

      // Check if the plugin code exists
      if (pluginCode.length > 0) {
        plugins.push({
          ...manifestJson,
          pluginPath: `${manifestFile.path.replace('.json', '.js')}`,
          manifestPath: manifestFile.path,
        });
      }
    }

    const {setPlugins} = usePluginStore.getState();

    setPlugins(plugins);

    return {
      status: 'success',
      data: plugins,
    };
  },
  async runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<
    Status<
      Category | Category[] | DetailedItem | (RawAudio | RawVideo)[] | null
    >
  > {
    return new Promise(async (resolve, reject) => {
      nodejs.channel.send(JSON.stringify({pluginPath, methodToRun, args}));
      nodejs.channel.addListener('message', async (response: any) => {
        var responseJson;
        try {
          responseJson = JSON.parse(response);
          if (responseJson.status === 'error' || responseJson.data === null) {
            reject(responseJson);
          }
        } catch (error) {
          console.warn('Invalid message' + response);
          return;
        }
        resolve({status: responseJson.status, data: responseJson.data});
      });
    }).then(value => {
      switch (methodToRun) {
        case 'search':
          return value as Status<Category>;
        case 'getCategory':
          return value as Status<Category>;
        case 'getCategories':
          return value as Status<Category[]>;
        case 'getItemDetails':
          return value as Status<DetailedItem>;
        case 'getItemMedia':
          return value as Status<(RawAudio | RawVideo)[]>;
        default:
          return {
            status: 'error',
            error: 'Invalid method to run',
          };
      }
    });
  },
};
