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
    search(query, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://example.com';
            const response = yield fetch(url)
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
                getNextPage: (page) => Promise.resolve([]),
                items: [],
            };
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
}
module.exports = {
    search: (query, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().search(query, page); }),
    getCategory: (category, page) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getCategory(category, page); }),
    getHomeCategories: () => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getHomeCategories(); }),
    getItemDetails: (id) => __awaiter(this, void 0, void 0, function* () { return new ExamplePlugin().getItemDetails(id); }),
};
