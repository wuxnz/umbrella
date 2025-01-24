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
    SourceType[SourceType["LightNovel"] = 5] = "LightNovel";
    SourceType[SourceType["Manga"] = 6] = "Manga";
    SourceType[SourceType["Manwa"] = 7] = "Manwa";
    SourceType[SourceType["Music"] = 8] = "Music";
    SourceType[SourceType["Novel"] = 9] = "Novel";
    SourceType[SourceType["Movie"] = 10] = "Movie";
    SourceType[SourceType["TvShow"] = 11] = "TvShow";
    SourceType[SourceType["WebNovel"] = 12] = "WebNovel";
    SourceType[SourceType["Webtoon"] = 13] = "Webtoon";
    SourceType[SourceType["Other"] = 14] = "Other";
})(SourceType || (SourceType = {}));
function toSourceType(type) {
    return SourceType[SourceType[type]];
}
exports.default = SourceType;
