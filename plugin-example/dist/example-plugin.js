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
    }
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/search.html?keyword=${query}&page=${page}`)
                    .then(response => response)
                    .then(data => data.text())
                    .catch(error => console.error(error));
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
    search: (query, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getItemDetails(id); }),
};
