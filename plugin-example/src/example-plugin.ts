// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead

class ExamplePlugin {
  async search(query: string, page?: number): Promise<object> {
    const url = 'https://example.com';

    const response = await fetch(url)
      .then(response => response.text())
      .catch(error => console.error(error));

    if (!response) {
      return {};
    }

    const titleRegex = /<title>(.*?)<\/title>/;
    const title = response.match(titleRegex)[1];

    return {
      name: title,
      description: `description for ${title}`,
      url: url,
      isPaginated: false,
      getNextPage: (page: number) => Promise.resolve([]),
      items: [],
    };
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
}

module.exports = {
  search: async (query: string, page?: number): Promise<object> =>
    new ExamplePlugin().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new ExamplePlugin().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new ExamplePlugin().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new ExamplePlugin().getItemDetails(id),
};
