// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ExamplePlugin {
    constructor() {
        this.baseUrl = 'https://ww23.gogoanimes.fi/';
        this.ajaxUrl = 'https://ajax.gogocdn.net/';
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/search.html?keyword=${query}&page=${page}`)
                    .then(response => response)
                    .then(data => data.text());
                if (!response) {
                    return {};
                }
                const ulRegex = /<ul[^>]*class="items"[^>]*>([\s\S]*?)<\/ul>/;
                const listUl = response.match(ulRegex)[1];
                const listItemsRegex = /<li>([\s\S]*?)<\/li>/g;
                const listItems = [...listUl.matchAll(listItemsRegex)].map(item => item[1]);
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
                    const imageUrl = item.match(imageUrlRegex)[1];
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
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCategory(category, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    getHomeCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/category/${id}`;
            const response = yield fetch(url)
                .then(response => response)
                .then(data => data.text());
            if (!response) {
                return {};
            }
            const nameRegex = /<h1>(.*?)<\/h1>/;
            const name = response.match(nameRegex)[1].trim();
            const descriptionRegex = /<p class="type">[\s\S]*<a href=".*?">(.*?)<\/a>/;
            const description = response.match(descriptionRegex)[1].trim();
            const imageUrlRegex = /<div class="anime_info_body_bg">[\s\S]*?<img src="(.*?)" alt=".*?"[\s\S]*\/></;
            const imageUrl = response.match(imageUrlRegex)[1];
            const sourceType = 'Anime';
            const language = name.includes('(Dub)') ? 'English' : 'Japanese';
            const synopsisRegex = /<div class="description">([\s\S]*?)<\/div>/;
            const synopsis = response.match(synopsisRegex)[1].trim();
            const genres = [];
            const genresRegex = /<p class="type">[\s\S]*<span>Genre:[\s\S]*?<a href="(.*?)" title="(.*?)">.*?<\/a>/g;
            const genresList = [...response.matchAll(genresRegex)];
            for (const genre of genresList) {
                genres.push({
                    id: genre[1].split('/').pop(),
                    name: genre[2],
                    url: genre[1].startsWith('/') ? this.baseUrl + genre[1] : genre[1],
                });
            }
            const releaseDateRegex = /<p class="type">[\s\S]*<span>Released:[\s\S]*?<\/span>(.*?)<\/p>/;
            const releaseDate = response.match(releaseDateRegex)[1].trim();
            const statusRegex = /<p class="type">[\s\S]*<span>Status:[\s\S]*?<\/span><a.*?>(.*?)<\/a>/;
            const status = response.match(statusRegex)[1].trim();
            const lastEpisodeNumberRegex = /<ul class="episode_list">[\s\S]*?<li>[\s\S]*?<a href=".*?">(.*?)<\/a>/;
            const lastEpisodeNumber = response
                .match(lastEpisodeNumberRegex)[response.match(lastEpisodeNumberRegex).length - 1].trim();
            const movieIdRegex = /<input type="hidden" value="(.*?)" id="movie_id" class="movie_id">/;
            const movieId = response.match(movieIdRegex)[1];
            const defaultEpRegex = /<input type="hidden" value="(.*?)" id="default_ep" class="default_ep">/;
            const defaultEp = response.match(defaultEpRegex)[1];
            const aliasRegex = /<input type="hidden" value="(.*?)" id="alias_anime" class="alias_anime">/;
            const alias = response.match(aliasRegex)[1];
            const episodes = [];
            const episodesUrl = `${this.ajaxUrl}ajax/load-list-episode?ep_start=0&ep_end=${lastEpisodeNumber}&id=${movieId}&default_ep=${defaultEp}&alias=${alias}`;
            const episodesResponse = yield fetch(episodesUrl)
                .then(response => response)
                .then(data => data.text());
            if (!episodesResponse) {
                return {
                    id: id,
                    name: name,
                    description: description,
                    imageUrl: imageUrl,
                    url: url,
                    type: sourceType,
                    language: language,
                    synopsis: synopsis,
                    genres: genres,
                    media: episodes,
                    releaseDate: releaseDate,
                    status: status,
                };
            }
            else {
                const episodesRegex = /<a href="([\s\S* ]*?)">[\s\S]*?<div class="name"><span>(.*?)<\/span>([\s\S]*?)<\/div>[\s\S]*?<div class="cate">(.*)?<\/div>/g;
                const episodesList = [...episodesResponse.matchAll(episodesRegex)];
                for (const episode of episodesList) {
                    episodes.push({
                        id: episode[1].split('/').pop(),
                        name: `${episode[2]} ${episode[3]}`.trim(),
                        url: episode[1].startsWith('/')
                            ? this.baseUrl + episode[1]
                            : episode[1],
                        language: episode[4].trim().toLowerCase() === 'english'
                            ? 'English'
                            : 'Japanese',
                    });
                }
                return {
                    id: id,
                    name: name,
                    description: description,
                    imageUrl: imageUrl,
                    url: url,
                    type: sourceType,
                    language: language,
                    synopsis: synopsis,
                    genres: genres,
                    media: episodes,
                    releaseDate: releaseDate,
                    status: status,
                };
            }
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getItemDetails(id); }),
};
