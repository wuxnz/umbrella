"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSourceType = toSourceType;
var SourceType;
(function (SourceType) {
    SourceType["Anime"] = "Anime";
    SourceType["Audio"] = "Audio";
    SourceType["Cartoon"] = "Cartoon";
    SourceType["Comic"] = "Comic";
    SourceType["Documentary"] = "Documentary";
    SourceType["LightNovel"] = "LightNovel";
    SourceType["Manga"] = "Manga";
    SourceType["Manwa"] = "Manwa";
    SourceType["Music"] = "Music";
    SourceType["Novel"] = "Novel";
    SourceType["Movie"] = "Movie";
    SourceType["TvShow"] = "TvShow";
    SourceType["WebNovel"] = "WebNovel";
    SourceType["Webtoon"] = "Webtoon";
    SourceType["Other"] = "Other";
})(SourceType || (SourceType = {}));
function toSourceType(type) {
    return SourceType[SourceType[type]];
}
exports.default = SourceType;
