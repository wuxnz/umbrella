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

    // console.log(pluginResponse.body);

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

    const pluginContent = await RNFS.readFile(pluginPath, 'utf8');
    console.log(pluginContent);
    // try {
    // const contentServiceFunctions = eval(pluginContent);

    //   console.log(contentServiceFunctions);

    // const contentService = {
    //   search(query: string, page?: number): Promise<Category> {
    //     return contentServiceFunctions.search(
    //       query,
    //       page,
    //     ) as Promise<Category>;
    //   },
    //   getCategory(category: string, page?: number): Promise<Category> {
    //     return contentServiceFunctions.getCategory(category, page);
    //   },
    //   getHomeCategories(): Promise<Category[]> {
    //     return contentServiceFunctions.getHomeCategories() as Promise<
    //       Category[]
    //     >;
    //   },
    //   getItemDetails(id: string): Promise<DetailedItem> {
    //     return contentServiceFunctions.getItemDetails(id);
    //   },
    // } as ContentService;

    //   // ************************
    //   // const axios = await import('axios');
    //   // const BeautifulSoup = await import('beautiful-soup-js');
    //   // const searchResult = await (async () => {
    //   //   const CryptoJS = await import('react-native-crypto-js');
    //   //   console.log('CryptoJS:', CryptoJS);

    //   //   const func = new Function('CryptoJS', contentServiceFunctions.search);
    //   //   return func(CryptoJS);
    //   // })();

    //   // console.log('searchResult', searchResult);
    //   // ************************

    //   // const contentService = new EvaluatedContentService();

    //   // console.log(contentService);
    //   // console.log(typeof contentService);

    //   // const result = await (async () => {
    //   //   const axios = await import('axios');
    //   //   const BeautifulSoup = await import('beautiful-soup-js');
    //   //   // const CryptoJS= await import('crypto-js');

    //   //   const func = new Function(
    //   //     'axios',
    //   //     'BeautifulSoup',

    //   //   );
    //   //   return func(axios, BeautifulSoup);
    //   // })();

    //   // const searchResult = await (async () => {
    //   //   const axios = await import('axios');
    //   //   const BeautifulSoup = await import('beautiful-soup-js');
    //   //   // const CryptoJS= await import('crypto-js');

    //   //   const func = new Function(
    //   //     'axios',
    //   //     'BeautifulSoup',
    //   //     contentServiceFunctions.getHomeCategories,
    //   //   );
    //   //   return func(axios, BeautifulSoup);
    //   // })();

    //   console.log(contentService);
    //   // const CryptoJS = await import('crypto-js');
    //   // console.log('CryptoJS from app', CryptoJS);
    //   const result = await contentService.search('', 1);
    //   console.log('result', result);

    const plugin: Plugin = {
      ...manifest,
      pluginPath: pluginPath,
      pluginUrl: manifest.pluginUrl,
      // contentService: contentService,
      // contentServiceSource: pluginContent,
    };

    await this.runPluginMethodInSandbox(pluginPath, 'search', ['test']);

    return {
      status: 'success',
      data: plugin,
    };
    // } catch (err) {
    //   console.log(err);
    // }

    // console.log('past eval');

    // return {
    //   status: 'error',
    //   error: 'Could not evaluate plugin',
    // };
  },
  async runPluginMethodInSandbox(
    pluginPath: string,
    methodToRun: string,
    args: any[],
  ): Promise<Status<Category | Category[] | DetailedItem | null>> {
    return new Promise(async (resolve, reject) => {
      nodejs.channel.send(JSON.stringify({pluginPath, methodToRun, args}));
      nodejs.channel.addListener('message', async (response: any) => {
        var data: Category | Category[] | DetailedItem | null = null;
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
        console.log('response', response);
        switch (methodToRun) {
          case 'search':
            data = response.data as Category;
            break;
          case 'getCategory':
            data = response.data as Category;
            break;
          case 'getCategories':
            data = response.data as Category[];
            break;
          case 'getItemDetails':
            data = response.data as Category;
            break;
          default:
            break;
        }
        // while (!data) {
        //   await new Promise(resolve =>
        //     setTimeout(() => {
        //       resolve(true);
        //     }, 5000),
        //   );
        //   console.warn('Waiting for response...');
        // }
        // if (!data) {
        // console.error(`Couldn't parse response: ${response}`);
        // reject(new Error(`Couldn't parse response: ${response}`));
        // return;
        // }
        // console.log(data);
        // Alert.alert('From NodeJS', JSON.stringify(data));
        // resolve({status: 'success', data: data});
        resolve({status: responseJson.status, data: data});
      });
      // while (!data) {
      //   await new Promise(resolve => {
      //     setTimeout(() => {
      //       Alert.alert('From NodeJS', 'Waiting for response...');
      //       console.log('data', data);
      //       resolve(true);
      //     }, 1000);
      //   });
      // }
      // resolve({status: 'success', data: data});
    });
  },
};
