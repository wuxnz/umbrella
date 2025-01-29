// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead

class ExamplePlugin {
  baseUrl = 'https://ww23.gogoanimes.fi/';
  async search(query: string, page?: number) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search.html?keyword=${query}&page=${page}`,
      )
        .then(response => response)
        .then(data => data.text())
        .catch(error => console.error(error));

      if (!response) {
        return {};
      }

      const ulRegex = /<ul[^>]*class="items"[^>]*>([\s\S]*?)<\/ul>/;
      const listUl = response.match(ulRegex)[1];

      const listItemsRegex = /<li>([\s\S]*?)<\/li>/g;
      const listItems = [...listUl.matchAll(listItemsRegex)].map(
        item => item[1],
      );

      const items = [];

      const idRegex = /<a href="\/category\/(.*?)" title=".*?">/;
      const nameRegex = /<a href="\/category\/.*?" title="(.*?)">/;
      const descriptionRegex = /(Released: .*?)<\/p>/;
      const imageUrlRegex = /<img src="(.*?)" alt=".*?"[\s\S]*\/>/;
      const sourceType = 'Anime';

      for (const item of listItems) {
        const id = item.match(idRegex)[1];
        const name = item.match(nameRegex)[1];
        const description = item.match(descriptionRegex)[1].trim();
        var imageUrl = item.match(imageUrlRegex)[1];

        if (imageUrl.startsWith('/cover')) {
          imageUrl = `${this.baseUrl}${imageUrl}`;
        }

        items.push({
          id,
          name,
          description,
          imageUrl,
          url: `${this.baseUrl}/category/${id}`,
          type: sourceType,
        });
      }

      return {
        name: 'Gogoanime',
        description: `Search results for ${query}`,
        url: decodeURIComponent(`${this.baseUrl}/search.html?keyword=${query}`),
        isPaginated: true,
        nextPageNumber: page + 1,
        previousPageNumber: page > 1 ? page - 1 : undefined,
        items: items,
      };
    } catch (err) {
      throw err;
    }
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
    new ExamplePlugin().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new ExamplePlugin().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new ExamplePlugin().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new ExamplePlugin().getItemDetails(id),
};
