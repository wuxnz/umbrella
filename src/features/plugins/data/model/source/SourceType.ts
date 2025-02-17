enum SourceType {
  Audio = 'Audio',
  Image = 'Image',
  Live = 'Live',
  Text = 'Text',
  Video = 'Video',
  Other = 'Other',
}

export function toSourceType(type: string): string {
  return SourceType[SourceType[type as keyof typeof SourceType]];
}

export default SourceType;
