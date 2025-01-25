// @ts-nocheck
// ^ Delete this line when writing your own plugin and add it back when compiling
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
            try {
                const plainText = 'my message';
                const key = 'secret key 123';
                const encoder = new TextEncoder();
                const data = encoder.encode(plainText);
                const encodedKey = encoder.encode(key);
                // Derive a 256-bit key from the provided key
                const cryptoKey = yield crypto.subtle.importKey('raw', encodedKey, { name: 'AES-CBC' }, false, ['encrypt']);
                // Generate a random Initialization Vector (IV)
                const iv = crypto.getRandomValues(new Uint8Array(16));
                // Encrypt the data
                const encryptedData = yield crypto.subtle.encrypt({ name: 'AES-CBC', iv }, cryptoKey, data);
                console.log('encryptedData', encryptedData);
            }
            catch (e) {
                console.error(e);
            }
            const url = 'https://example.com';
            const response = yield fetch(url)
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
            const title = soup.find({ name: 'title' });
            console.log(title.text.trim());
            return {
                name: title.text.trim(),
                description: 'description',
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
