// Get base url from string
// TODO: Use this for getting base url from deeplink
function getBaseUrlFromString(url: string) {
  return new URL(url).origin;
}
