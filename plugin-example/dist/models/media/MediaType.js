"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMediaType = toMediaType;
var MediaType;
(function (MediaType) {
    MediaType[MediaType["ExtractorVideo"] = 0] = "ExtractorVideo";
    MediaType[MediaType["RawVideo"] = 1] = "RawVideo";
    MediaType[MediaType["ExtractorAudio"] = 2] = "ExtractorAudio";
    MediaType[MediaType["RawAudio"] = 3] = "RawAudio";
    MediaType[MediaType["Image"] = 4] = "Image";
    MediaType[MediaType["Other"] = 5] = "Other";
})(MediaType || (MediaType = {}));
function toMediaType(type) {
    return MediaType[MediaType[type]];
}
exports.default = MediaType;
