// Get base url from string
// TODO: Use this for getting base url from deeplink
function getBaseUrlFromString(url: string) {
  return url.split('/').slice(0, 3).join('/');
}

export default getBaseUrlFromString;
