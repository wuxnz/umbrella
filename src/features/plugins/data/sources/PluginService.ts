import Status from '../../../../core/shared/types/Status';
import constants from '../../../../core/utils/constants';
import {Plugin} from '../../domain/entities/Plugin';
import Source from '../models/source/Source';
import {toSourceType} from '../models/source/SourceType';
import * as RNFS from '@dr.pogodin/react-native-fs';
import ContentService from '../models/ContentService';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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

    const manifestFilePath =
      RNFS.DocumentDirectoryPath +
      `${constants.PLUGIN_FOLDER_NAME}/${manifestJson.author}_${manifestJson.name}.json`;

    await RNFS.downloadFile({
      fromUrl: manifestUrl,
      toFile: manifestFilePath,
    });

    // const plugin = await response.json();
    return {
      status: 'success',
      data: {
        ...manifestJson,
        sourceType: toSourceType(manifestJson.sourceType),
        mainifestFilePath: manifestFilePath,
        manifestUrl: manifestUrl,
      },
    };
  },
  async fetchPlugin(manifest: Source): Promise<Status<Plugin>> {
    if (!manifest.pluginUrl) {
      return {
        status: 'error',
        error: 'No plugin url',
      };
    }

    const pluginResponse = await fetch(manifest.pluginUrl);

    if (!pluginResponse.ok) {
      return {
        status: 'error',
        error: pluginResponse.statusText,
      };
    }

    const pluginFilePath =
      RNFS.DocumentDirectoryPath +
      `${constants.PLUGIN_FOLDER_NAME}/${manifest.author}_${manifest.name}.js`;

    await RNFS.downloadFile({
      fromUrl: manifest.pluginUrl,
      toFile: pluginFilePath,
    });

    const pluginContent = await RNFS.readFile(pluginFilePath, 'utf8');
    const module = await eval(pluginContent);
    // const module = await import('./pa);
    const classNames = Object.keys(module).filter(
      key => typeof module[key] === 'function' && module[key].prototype,
    );
    const contentServiceClass = classNames.find(className => {
      const classMethods = Object.getOwnPropertyNames(
        module[className].prototype,
      );
      const contentServiceMethods = Object.keys(ContentService.prototype);
      return contentServiceMethods.every(method =>
        classMethods.includes(method),
      );
    });
    if (contentServiceClass) {
      const contentService = new module[
        contentServiceClass
      ]() as ContentService;
      const plugin = {
        ...manifest,
        pluginFilePath: pluginFilePath,
        pluginUrl: manifest.pluginUrl,
      };
      return {
        status: 'success',
        data: {
          ...manifest,
          pluginFilePath: pluginFilePath,
          pluginUrl: manifest.pluginUrl,
          contentService: contentService,
        },
      };
    } else {
      throw new Error('No class implements the ContentService interface');
    }
  },
};
