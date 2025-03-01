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
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class AllanimePlugin {
    constructor() {
        this.BASE_URL = 'https://allanime.to';
        this.API_HOST = 'https://api.allanime.day/api?';
        this.SEARCH_HASH = '06327bc10dd682e1ee7e07b6db9c16e9ad2fd56c1b769e47513128cd5c9fc77a';
        this.IMAGE_URL_BASE = 'https://wp.youtube-anime.com/aln.youtube-anime.com/';
        this.API_HEADERS = { Referer: `${this.BASE_URL}/` };
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const response = yield fetch(`${this.API_HOST}variables={"search":{"query":"${query}"},"limit":26,"page":${page},"countryOrigin":"ALL"}&extensions={"persistedQuery":{"version":1,"sha256Hash":"${this.SEARCH_HASH}"}}`, { headers: this.API_HEADERS })
                    .then(res => res.text())
                    .catch(error => console.error(error));
                if (!response) {
                    return {};
                }
                const data = JSON.parse(response);
                const resultsRaw = ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.shows) === null || _b === void 0 ? void 0 : _b.edges) || [];
                const items = [];
                for (const item of resultsRaw) {
                    const languages = [];
                    let episodeCount;
                    if (item.availableEpisodes) {
                        if (item.availableEpisodes.sub)
                            languages.push('sub');
                        if (item.availableEpisodes.dub)
                            languages.push('dub');
                        episodeCount =
                            (_d = (_c = item.availableEpisodes.sub) !== null && _c !== void 0 ? _c : item.availableEpisodes.dub) !== null && _d !== void 0 ? _d : 0;
                    }
                    let imageUrl = item.thumbnail || '';
                    if (/^images3/.test(imageUrl)) {
                        imageUrl = this.IMAGE_URL_BASE + imageUrl;
                    }
                    else if (/cdn\.myanimelist\.net|i\.ibb\.co/.test(imageUrl)) {
                        imageUrl = imageUrl.replace(/^https:\/\//, 'https://wp.youtube-anime.com/');
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
                    url: decodeURIComponent(`${this.API_HOST}variables={"search":{"query":"${query}"}}`),
                    isPaginated: true,
                    nextPageNumber: page + 1,
                    previousPageNumber: page > 1 ? page - 1 : undefined,
                    items,
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
            return {};
        });
    }
    getItemMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
module.exports = {
    search: (query, page) => __awaiter(this, void 0, void 0, function* () { return new AllanimePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(this, void 0, void 0, function* () { return new AllanimePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(this, void 0, void 0, function* () { return new AllanimePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(this, void 0, void 0, function* () { return new AllanimePlugin().getItemDetails(id); }),
    getItemMedia: (id) => __awaiter(this, void 0, void 0, function* () { return new AllanimePlugin().getItemMedia(id); }),
};
