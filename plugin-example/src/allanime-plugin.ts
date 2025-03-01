// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead

//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class AllanimePlugin {
  BASE_URL = 'https://allanime.to';
  API_HOST = 'https://api.allanime.day/api?';
  SEARCH_HASH =
    '06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a';
  IMAGE_URL_BASE = 'https://wp.youtube-anime.com/aln.youtube-anime.com/';

  API_HEADERS = {Referer: `${this.BASE_URL}/`};

  async search(query: string, page?: number) {
    try {
      const response = await fetch(
        `${this.API_HOST}variables={"search":{"query":"${query}"},"limit":26,"page":${page},"countryOrigin":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"${this.SEARCH_HASH}"}}`,
        {headers: this.API_HEADERS},
      )
        .then(res => res.text())
        .catch(error => console.error(error));

      if (!response) {
        return {};
      }

      const data = JSON.parse(response);
      const resultsRaw = data?.data?.shows?.edges || [];
      const items = [];

      for (const item of resultsRaw) {
        const languages = [];
        let episodeCount;
        if (item.availableEpisodes) {
          if (item.availableEpisodes.sub) languages.push('sub');
          if (item.availableEpisodes.dub) languages.push('dub');
          episodeCount =
            item.availableEpisodes.sub ?? item.availableEpisodes.dub ?? 0;
        }

        let imageUrl = item.thumbnail || '';
        if (/^images3/.test(imageUrl)) {
          imageUrl = this.IMAGE_URL_BASE + imageUrl;
        } else if (/cdn\.myanimelist\.net|i\.ibb\.co/.test(imageUrl)) {
          imageUrl = imageUrl.replace(
            /^https:\/\//,
            'https://wp.youtube-anime.com/',
          );
        }

        items.push({
          id: item._id,
          name: item.englishName || item.name,
          description: '',
          imageUrl,
          url: `${this.BASE_URL}/category/${item._id}`,
          type: 'Anime',
          languages,
          episodeCount,
        });
      }

      return {
        name: 'AllAnime',
        description: `Search results for ${query}`,
        url: decodeURIComponent(
          `${this.API_HOST}variables={"search":{"query":"${query}"}}`,
        ),
        isPaginated: true,
        nextPageNumber: page + 1,
        previousPageNumber: page > 1 ? page - 1 : undefined,
        items,
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
    new AllanimePlugin().search(query, page),
  getCategory: async (category: string, page?: number): Promise<object> =>
    new AllanimePlugin().getCategory(category, page),
  getHomeCategories: async (): Promise<object[]> =>
    new AllanimePlugin().getHomeCategories(),
  getItemDetails: async (id: string): Promise<object> =>
    new AllanimePlugin().getItemDetails(id),
  getItemMedia: async (id: string): Promise<object[]> =>
    new AllanimePlugin().getItemMedia(id),
};
