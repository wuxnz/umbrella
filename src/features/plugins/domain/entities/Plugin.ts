export interface Plugin {
  name: string; // Unique identifier for the plugin
  version: string; // Plugin version
  description?: string; // Optional plugin description
  initialize: () => void; // Called to register the plugin with the app
  dispose?: () => void; // Cleanup logic for removing the plugin
  routes?: Record<string, React.ComponentType>; // Routes/screens exposed by the plugin
  services?: Record<string, any>; // Services or utilities added by the plugin
}
