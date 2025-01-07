export class PluginViewModel {
  private actions: Record<string, () => void> = {};

  registerAction(name: string, action: () => void) {
    this.actions[name] = action;
  }

  executeAction(name: string) {
    if (this.actions[name]) {
      this.actions[name]();
    }
  }
}
