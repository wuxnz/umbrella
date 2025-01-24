import Status from '../../../../core/shared/types/Status';
import constants from '../../../../core/utils/constants';
import {Plugin} from '../../domain/entities/Plugin';
import Source from '../models/source/Source';
import {toSourceType} from '../models/source/SourceType';
import * as RNFS from '@dr.pogodin/react-native-fs';
import ContentService from '../models/ContentService';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

import axios from 'axios';
import BeautifulSoup from 'beautiful-soup-js';
import CryptoJS from 'crypto-js';
import Category from '../models/item/Category';
import DetailedItem from '../models/item/DetailedItem';
import * as crypto from 'react-native-crypto-js';

export const PluginService = {
  async fetchManifest(manifestUrl: string): Promise<Status<Source>> {
    // console.log(crypto);

    const manifest = await fetch(manifestUrl);
    const manifestJson = await manifest.json();

    if (!manifest.ok) {
      return {
        status: 'error',
        error: manifest.statusText,
      };
    }

    const manifestFilePath =
      RNFS.ExternalStorageDirectoryPath +
      `/${constants.APP_NAME}/` +
      `${constants.PLUGIN_FOLDER_NAME}/${
        manifestJson.author
      }_${manifestJson.name.split(' ').join('_')}.json`;

    if (
      !(await RNFS.exists(manifestFilePath.split('/').slice(0, -1).join('/')))
    ) {
      await RNFS.mkdir(manifestFilePath.split('/').slice(0, -1).join('/'));
    }

    await RNFS.downloadFile({
      fromUrl: manifestUrl,
      toFile: manifestFilePath,
    });

    return {
      status: 'success',
      data: {
        ...manifestJson,
        sourceType: toSourceType(manifestJson.sourceType),
        mainifestFilePath: manifestFilePath,
      },
    };
  },
  async deleteManifestFile(manifest: Source): Promise<Status<void>> {
    if (!manifest.manifestFilePath) {
      return {
        status: 'error',
        error: 'No manifest file path',
      };
    }

    return {
      status: 'success',
      data: await RNFS.unlink(manifest.manifestFilePath),
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

    const pluginFilePath =
      RNFS.ExternalStorageDirectoryPath +
      `/${constants.APP_NAME}/` +
      `${constants.PLUGIN_FOLDER_NAME}/${manifest.author}_${manifest.name
        .split(' ')
        .join('_')}.js`;

    if (
      !(await RNFS.exists(pluginFilePath.split('/').slice(0, -1).join('/')))
    ) {
      await RNFS.mkdir(pluginFilePath.split('/').slice(0, -1).join('/'));
    }

    await RNFS.writeFile(pluginFilePath, await pluginJS, 'utf8');

    const pluginContent = await RNFS.readFile(pluginFilePath, 'utf8');
    console.log(pluginContent);
    try {
      const contentServiceFunctions = eval(pluginContent);

      console.log(contentServiceFunctions);

      const contentService = {
        search(query: string, page?: number): Promise<Category> {
          return contentServiceFunctions.search(
            query,
            page,
          ) as Promise<Category>;
        },
        getCategory(category: string, page?: number): Promise<Category> {
          return contentServiceFunctions.getCategory(category, page);
        },
        getHomeCategories(): Promise<Category[]> {
          return contentServiceFunctions.getHomeCategories() as Promise<
            Category[]
          >;
        },
        getItemDetails(id: string): Promise<DetailedItem> {
          return contentServiceFunctions.getItemDetails(id);
        },
      } as ContentService;

      // ************************
      // const axios = await import('axios');
      // const BeautifulSoup = await import('beautiful-soup-js');
      // const searchResult = await (async () => {
      //   const CryptoJS = await import('react-native-crypto-js');
      //   console.log('CryptoJS:', CryptoJS);

      //   const func = new Function('CryptoJS', contentServiceFunctions.search);
      //   return func(CryptoJS);
      // })();

      // console.log('searchResult', searchResult);
      // ************************

      // const contentService = new EvaluatedContentService();

      // console.log(contentService);
      // console.log(typeof contentService);

      // const result = await (async () => {
      //   const axios = await import('axios');
      //   const BeautifulSoup = await import('beautiful-soup-js');
      //   // const CryptoJS= await import('crypto-js');

      //   const func = new Function(
      //     'axios',
      //     'BeautifulSoup',

      //   );
      //   return func(axios, BeautifulSoup);
      // })();

      // const searchResult = await (async () => {
      //   const axios = await import('axios');
      //   const BeautifulSoup = await import('beautiful-soup-js');
      //   // const CryptoJS= await import('crypto-js');

      //   const func = new Function(
      //     'axios',
      //     'BeautifulSoup',
      //     contentServiceFunctions.getHomeCategories,
      //   );
      //   return func(axios, BeautifulSoup);
      // })();

      console.log(contentService);
      // const CryptoJS = await import('crypto-js');
      // console.log('CryptoJS from app', CryptoJS);
      const result = await contentService.search('', 1);
      console.log('result', result);

      return {
        status: 'success',
        data: {
          ...manifest,
          pluginFilePath: pluginFilePath,
          pluginUrl: manifest.pluginUrl,
          // contentService: contentService,
          contentService: contentService,
        },
      };
    } catch (err) {
      console.log(err);
    }

    console.log('past eval');

    return {
      status: 'error',
      error: 'Could not evaluate plugin',
    };
  },
};
