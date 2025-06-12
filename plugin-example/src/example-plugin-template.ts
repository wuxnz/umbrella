// Include ts-nocheck here if using modules that arent builtin
// to node and will live in the app's sandbox
// Modules included in the sandbox:
// - crypto-js (CryptoJS)
// - cheerio (Cheerio)
// You can use the modules above in this file via the name in parenthesis.
// You should only import built-in nodejs modules in this file with "require".
// !!WARNING!! You have to run "yarn install" and "npx tsc" in the nodejs-project folder.
// Example:
//   const $ = Cheerio.load(response);
//   const title = $('title').text();
//   var secret_key = CryptoJS.SHA256(title);
//   throw new Error(`${title} - ${secret_key}`); // This will throw an error in the app

//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class ExamplePluginTemplate {
  async search(query: string, page?: number) {
    return {};
  }

  async getCategory(category: string, page?: number): Promise<object> {
    return {};
  }

  async getHomeCategories(): Promise<object[]> {
    return [];
  }

  async getItemDetails(id: string): Promise<object> {
    return {};
  }

  async getItemMedia(id: string): Promise<object[]> {
    return [];
  }
}

module.exports = {
  search: async (query: string, page?: number): Promise<object> =>
    new ExamplePluginTemplate().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new ExamplePluginTemplate().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new ExamplePluginTemplate().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new ExamplePluginTemplate().getItemDetails(id),
  getItemMedia: async (id: string): Promise<object[]> =>
    new ExamplePluginTemplate().getItemMedia(id),
};
