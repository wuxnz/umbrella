"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSourceType = toSourceType;
var SourceType;
(function (SourceType) {
    SourceType[SourceType["Anime"] = 0] = "Anime";
    SourceType[SourceType["Audio"] = 1] = "Audio";
    SourceType[SourceType["Cartoon"] = 2] = "Cartoon";
    SourceType[SourceType["Comic"] = 3] = "Comic";
    SourceType[SourceType["Documentary"] = 4] = "Documentary";
    SourceType[SourceType["Image"] = 5] = "Image";
    SourceType[SourceType["LightNovel"] = 6] = "LightNovel";
    SourceType[SourceType["Manga"] = 7] = "Manga";
    SourceType[SourceType["Manwa"] = 8] = "Manwa";
    SourceType[SourceType["Music"] = 9] = "Music";
    SourceType[SourceType["Novel"] = 10] = "Novel";
    SourceType[SourceType["Movie"] = 11] = "Movie";
    SourceType[SourceType["TvShow"] = 12] = "TvShow";
    SourceType[SourceType["WebNovel"] = 13] = "WebNovel";
    SourceType[SourceType["Webtoon"] = 14] = "Webtoon";
    SourceType[SourceType["Other"] = 15] = "Other";
})(SourceType || (SourceType = {}));
function toSourceType(type) {
    return SourceType[SourceType[type]];
}
exports.default = SourceType;
