enum MediaType {
  ExtractorVideo,
  RawVideo,
  ExtractorAudio,
  RawAudio,
  Image,
  Other,
}

export function toMediaType(type: string): string {
  return MediaType[MediaType[type as keyof typeof MediaType]];
}

export default MediaType;
