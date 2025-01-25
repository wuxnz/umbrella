import Status from '../../../../core/shared/types/Status';
import constants from '../../../../core/utils/constants';
import {Plugin} from '../../domain/entities/Plugin';
import Source from '../models/source/Source';
import {toSourceType} from '../models/source/SourceType';
import * as RNFS from '@dr.pogodin/react-native-fs';
import Category from '../models/item/Category';
import DetailedItem from '../models/item/DetailedItem';
import nodejs from 'nodejs-mobile-react-native';

// Plugin service
// This is the service that gets the data for the plugin
// Will be used by the plugin repository implementation
export const PluginService = {
  async fetchManifest(manifestUrl: string): Promise<Status<Source>> {
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
        mainifestPath: manifestPath,
      },
    };
  },
  async deleteManifestFile(manifest: Source): Promise<Status<void>> {
    if (!manifest.manifestPath) {
      return {
        status: 'error',
        error: 'No manifest file path',
      };
    }

    return {
      status: 'success',
      data: await RNFS.unlink(manifest.manifestPath),
    };
  },
  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
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

    const result = await this.runPluginMethodInSandbox(pluginPath, 'search', [
      'test',
    ]);

    return {
      status: 'success',
      data: plugin,
    };
  },
  async runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>> {
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
        default:
          return {
            status: 'error',
            error: 'Invalid method to run',
          };
      }
    });
  },
};
