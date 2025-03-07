enum MediaType {
  ExtractorVideo = 'ExtractorVideo',
  RawVideo = 'RawVideo',
  ExtractorAudio = 'ExtractorAudio',
  RawAudio = 'RawAudio',
  Image = 'Image',
  Other = 'Other',
}

export function toMediaType(type: string): string {
  return MediaType[MediaType[type as keyof typeof MediaType]];
}

export default MediaType;
