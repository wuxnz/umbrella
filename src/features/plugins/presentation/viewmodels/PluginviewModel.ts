export class PluginViewModel {
  private plugins: Record<string, () => void> = {};

  registerPlugins(name: string, plugins: () => void) {
    this.plugins[name] = plugins;
  }

  executePlugins(name: string) {
    if (this.plugins[name]) {
      this.plugins[name]();
    }
  }
}
