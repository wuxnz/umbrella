import {ContentService} from '../../data/models/ContentService';

export interface Plugin {
  sourceType: string;
  author?: string;
  name: string; // Unique identifier for the plugin
  version: number; // Plugin version
  description?: string; // Optional plugin description
  // initialize: () => void; // Called to register the plugin with the app
  // dispose?: () => void; // Cleanup logic for removing the plugin
  homePageUrl?: string; // Optional URL to the home page for the plugin
  iconUrl?: string; // Optional URL to an icon for the plugin
  pluginFileUrl: string; // Optional URL to the plugin file
  banner?: React.ComponentType; // Optional banner to show in plugin page
  contentService?: ContentService; // Content service provided by the plugin to get content
}
