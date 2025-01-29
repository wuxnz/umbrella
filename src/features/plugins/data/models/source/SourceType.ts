enum SourceType {
  Anime = 'Anime',
  Audio = 'Audio',
  Cartoon = 'Cartoon',
  Comic = 'Comic',
  Documentary = 'Documentary',
  LightNovel = 'LightNovel',
  Manga = 'Manga',
  Manwa = 'Manwa',
  Music = 'Music',
  Novel = 'Novel',
  Movie = 'Movie',
  TvShow = 'TvShow',
  WebNovel = 'WebNovel',
  Webtoon = 'Webtoon',
  Other = 'Other',
}

export function toSourceType(type: string): string {
  return SourceType[SourceType[type as keyof typeof SourceType]];
}

export default SourceType;
