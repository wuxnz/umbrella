enum SourceType {
  Anime,
  Audio,
  Cartoon,
  Comic,
  Documentary,
  LightNovel,
  Manga,
  Manwa,
  Music,
  Novel,
  Movie,
  TvShow,
  WebNovel,
  Webtoon,
  Other,
}

export function toSourceType(type: string): string {
  return SourceType[SourceType[type as keyof typeof SourceType]];
}

export default SourceType;
