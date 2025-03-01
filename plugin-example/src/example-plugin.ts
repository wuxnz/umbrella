// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead

//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class ExamplePlugin {
  baseUrl = 'https://ww24.gogoanimes.fi';
  ajaxUrl = 'https://ajax.gogocdn.net';
  sourceType = 'Video';
  async search(query: string, page?: number) {
    try {
      const url = `${this.baseUrl}/search.html?keyword=${query}&page=${
        page || 1
      }`;
      const response = await fetch(url)
        .then(response => response)
        .then(data => data.text());
      if (!response) {
        return {};
      }
      const ulRegex = /<ul.*class="items".*>([\s\S]*?)<\/ul>/;
      const listUl = response.match(ulRegex)[1];
      const listItemsRegex = /<li>([\s\S]*?)<\/li>/g;
      const listItems = [...listUl.matchAll(listItemsRegex)].map(
        item => item[1],
      );
      const items = [];
      const idRegex = /<a href="\/category\/(.*?)" title=".*?">/;
      const nameRegex = /<a href="\/category\/.*?" title="(.*?)">/;
      const descriptionRegex = /(Released: .*?)<\/p>/;
      const imageUrlRegex = /<img src="(.*?)".*alt=".*?"[\s\S]*?>/;
      for (const item of listItems) {
        const id = item.match(idRegex)[1];
        const name = item.match(nameRegex)[1];
        const description = item.match(descriptionRegex)[1].trim();
        var imageUrl = item.match(imageUrlRegex)[1];
        if (imageUrl.startsWith('/')) {
          imageUrl = `${this.baseUrl}/${imageUrl}`;
        }
        items.push({
          id,
          name,
          description,
          imageUrl,
          url: url,
          type: this.sourceType,
        });
      }
      return {
        name: 'Gogoanime',
        description: `Search results for ${query}`,
        url: decodeURIComponent(
          `${this.baseUrl}/search.html?keyword=${query}&page=${page}`,
        ),
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
    const url = `${this.baseUrl}/category/${id}`;
    const response = await fetch(url)
      .then(response => response)
      .then(data => data.text());
    if (!response) {
      return {};
    }
    const nameRegex = /<h1>(.*?)<\/h1>/;
    const name = response.match(nameRegex)[1].trim();
    const descriptionRegex =
      /<p class="type">[\s\S]*?<span>Type:.*<\/span>[\s\s]*?<a href=.*>(.*)<\/a>/;
    const description = response.match(descriptionRegex)[1].trim();
    const imageUrlRegex =
      /<div class="anime_info_body_bg">[\s\S]*?<img src="(.*?)"/;
    var imageUrl = response.match(imageUrlRegex)[1];
    if (imageUrl.startsWith('/')) {
      imageUrl = `${this.baseUrl}/${imageUrl}`;
    }
    const language = name.includes('(Dub)') ? 'English' : 'Japanese';
    const synopsisRegex = /<div class="description">([\s\S]*?)<\/div>/;
    var synopsis = response.match(synopsisRegex)[1].trim();
    const openingTagRegex = /<.*?>/g;
    synopsis = synopsis.replace(openingTagRegex, '');
    const closingTagRegex = /<\/.*?>/g;
    synopsis = synopsis.replace(closingTagRegex, '');
    const genres = [];
    const genresElementRegex = /Genre:.*<\/span>[\s\S]*?<\/p>/;
    const genresElement = response.match(genresElementRegex)[0];
    const genresRegex = /<a href="(.*?)" title="(.*?)">.*?/g;
    const genresList = [...genresElement.matchAll(genresRegex)];
    for (const genre of genresList) {
      if (genre[1].startsWith('/')) {
        genre[1] = `${this.baseUrl}/${genre[1]}`;
      }
      if (genre[1] === 'javascript:void(0);') {
        continue;
      }
      genres.push({
        id: genre[1].split('/').pop(),
        name: genre[2],
        url: genre[1].startsWith('/') ? this.baseUrl + genre[1] : genre[1],
      });
    }
    const releaseDateRegex =
      /<p class="type">[\s\S]*<span>Released:[\s\S]*?<\/span>(.*?)<\/p>/;
    const releaseDate = response.match(releaseDateRegex)[1].trim();
    const statusRegex =
      /Status:[\s\S]*?<\/span>[\s\S]*?<a href=".*?">(.*?)<\/a>/;
    const status = response.match(statusRegex)[1].trim();
    const ohterNamesRegex =
      /<p class="type other-name">[\s\S]*<span>Other name:[\s\S]*?<\/span>[\s\S]*?<a.* title="(.*?)<\/a>[\s\S]*?<\/p>/;
    const otherNames = response.match(ohterNamesRegex)[1].trim().split(',');
    const lastEpisodeNumber = 10000;
    const movieIdRegex = /value="(.*?)" id="movie_id" class="movie_id"/;
    const movieId = response.match(movieIdRegex)[1];
    const defaultEpRegex = /value="(.*?)" id="default_ep" class="default_ep"/;
    const defaultEp = response.match(defaultEpRegex)[1];
    const aliasRegex = /value="(.*?)" id="alias_anime" class="alias_anime"/;
    const alias = response.match(aliasRegex)[1];
    const episodes = [];
    const episodesUrl = `${this.ajaxUrl}/ajax/load-list-episode?ep_start=0&ep_end=${lastEpisodeNumber}&id=${movieId}&default_ep=${defaultEp}&alias=${alias}`;
    const episodesResponse = await fetch(episodesUrl)
      .then(response => response)
      .then(data => data.text());
    if (!episodesResponse) {
      return {
        id: id,
        name: name,
        description: description,
        imageUrl: imageUrl,
        url: url,
        type: this.sourceType,
        language: language,
        synopsis: synopsis,
        genres: genres,
        media: episodes,
        releaseDate: releaseDate,
        status: status,
        otherNames: otherNames,
      };
    } else {
      const episodesRegex =
        /<a href="([\s\S* ]*?)"[\s\S]*?class.*>[\s\S]*?<div class="name"><span>(.*?)<\/span>([\s\S]*?)<\/div>[\s\S]*?<div class="cate">(.*)?<\/div>/g;
      const episodesList = [...episodesResponse.matchAll(episodesRegex)];
      for (const episode of episodesList) {
        episodes.push({
          id: episode[1].split('/').pop(),
          name: `${episode[2]} ${episode[3]}`.trim(),
          url: episode[1].startsWith('/')
            ? this.baseUrl + episode[1]
            : episode[1],
          language:
            episode[4].trim().toLowerCase() === 'english'
              ? 'English'
              : 'Japanese',
          number: parseInt(episode[3].trim()),
        });
      }
      return {
        id: id,
        name: name,
        description: description,
        imageUrl: imageUrl,
        url: url,
        type: this.sourceType,
        language: language,
        synopsis: synopsis,
        genres: genres,
        media: episodes,
        releaseDate: releaseDate,
        status: status,
        otherNames: otherNames,
      };
    }
  }

  async vidHideExtractor(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        Referer: url,
      },
    })
      .then(response => response)
      .then(data => data.text());
    if (!response) {
      return null;
    }
    const scriptRegex = /eval([\s\S]*?)<\/script>/;
    const script = response.match(scriptRegex)[1];
    const urlSchemeRegex = /http./;
    var urlScheme = script.match(urlSchemeRegex)[0];
    if (urlScheme.endsWith('|')) {
      urlScheme = urlScheme.slice(0, -1);
    }
    const sAndFRegex = /data\|+([0-9]*)\|+([0-9]*)/;
    const s = script.match(sAndFRegex)[1];
    const f = script.match(sAndFRegex)[2];
    const srvRegex = /file\|+[0-9]*\|(.*?)\|/;
    const srv = script.match(srvRegex)[1];
    const iRegex = /i=([0-9\.]*)&/;
    const i = script.match(iRegex)[1];
    const asnRegex = /text\|+([0-9]*)\|/;
    const asn = script.match(asnRegex)[1];
    const domainEndRegex = /logo\|+(.*?)\|/;
    const domainEnd = script.match(domainEndRegex)[1];
    const infoChunkStart = script.split('|width|')[1];
    const infoChunkEnd = infoChunkStart.split('|sources|')[0];
    const infoChunkSplit = infoChunkEnd.split('|').reverse();
    const infoChunkOffset = infoChunkSplit[2] === 'hls2' ? 0 : 1;
    const m3u8Index = infoChunkSplit.indexOf('m3u8');
    const origin = `${urlScheme}://${infoChunkSplit[0]}.${infoChunkSplit[1]}${
      infoChunkOffset === 0 ? '' : '-' + infoChunkSplit[2]
    }.${domainEnd}/${infoChunkSplit[infoChunkOffset + 2]}`;
    var urlset = '/';
    if (origin.includes('urlset')) {
      urlset = ',l,n,h,.urlset/';
    }
    var t;
    var e;
    if (infoChunkSplit[m3u8Index + 2] === '129600') {
      t = infoChunkSplit[m3u8Index + 1];
      e = infoChunkSplit[m3u8Index + 2];
    } else {
      t = infoChunkSplit[m3u8Index + 2] + '-' + infoChunkSplit[m3u8Index + 1];
      e = infoChunkSplit[m3u8Index + 3];
    }
    const videoUrl = `${origin}/${infoChunkSplit[infoChunkOffset + 3]}/${
      infoChunkSplit[infoChunkOffset + 4]
    }/${
      infoChunkSplit[infoChunkOffset + 5]
    }${urlset}master.m3u8?t=${t}&s=${s}&e=129600&f=${f}&srv=${srv}&i=${i}&sp=${
      infoChunkSplit[infoChunkSplit.indexOf('sp') + 1]
    }&p1=${srv}&p2=${srv}&asn=${asn}`;
    return videoUrl;
  }

  async getItemMedia(id: string): Promise<object[]> {
    const episodePageResponse = await fetch(`${this.baseUrl}/${id}`)
      .then(response => response)
      .then(data => data.text());
    if (!episodePageResponse) {
      return [];
    }
    const allUlRegex = /<ul>[\s\S]*?<\/ul>/g;
    const ul = [...episodePageResponse.matchAll(allUlRegex)].filter(item =>
      item[0].includes('data-video'),
    );
    if (ul.length !== 1) {
      return [];
    }
    const ulText = ul[0][0];
    const embedInfoRegex =
      /<li class=".*">[\s\S]*?<a.*data-video="(.*?)".*>[\s\S]*?<i class="iconlayer-(.*?)">?<\/i>(.*)<span>/g;
    const embedInfoList = [...ulText.matchAll(embedInfoRegex)].map(item => ({
      url: new URL(item[1]),
      iconUrl: `${this.baseUrl}img/${item[2]}.png`,
      name: item[3],
    }));
    const vidHideSources = embedInfoList.filter(item =>
      item['name'].toLowerCase().includes('vidhide'),
    );
    var itemMedia = [];
    for (const source of vidHideSources) {
      const videoUrl = await this.vidHideExtractor(source['url']);
      itemMedia.push({
        type: 'RawVideo',
        url: videoUrl,
        name: source['name'],
        iconUrl: source['iconUrl'],
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
          Referer: source['url'].origin,
        },
      });
    }
    return itemMedia;
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
  getItemMedia: async (id: string): Promise<object[]> =>
    new ExamplePlugin().getItemMedia(id),
};
