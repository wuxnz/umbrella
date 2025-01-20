function getBaseUrlFromString(url: string) {
  return new URL(url).origin;
}
