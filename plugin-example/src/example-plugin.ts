// @ts-nocheck
// ^ Delete this line when writing your own plugin and add it back when compiling

class ExamplePlugin {
  async search(query: string, page?: number): Promise<object> {
    try {
      const plainText = 'my message';
      const key = 'secret key 123';
      const encoder = new TextEncoder();
      const data = encoder.encode(plainText);
      const encodedKey = encoder.encode(key);

      // Derive a 256-bit key from the provided key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encodedKey,
        {name: 'AES-CBC'},
        false,
        ['encrypt'],
      );

      // Generate a random Initialization Vector (IV)
      const iv = crypto.getRandomValues(new Uint8Array(16));

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        {name: 'AES-CBC', iv},
        cryptoKey,
        data,
      );

      console.log('encryptedData', encryptedData);
    } catch (e) {
      console.error(e);
    }
    const url = 'https://example.com';

    const response = await fetch(url)
      .then(response => response.text())
      .catch(error => console.error(error));

    if (!response) {
      console.log('No response');
      return {};
    }

    const soup = new BeautifulSoup(response, false);

    console.log(response);
    // const titleRegex = /<title>(.*?)<\/title>/;

    // const title = response.match(titleRegex)[1];

    const title = soup.find({name: 'title'});

    console.log(title.text.trim());
    return {
      name: title.text.trim(),
      description: 'description',
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
