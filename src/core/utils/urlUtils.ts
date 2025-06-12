/**
 * URL utility functions for React Native compatibility
 * Provides safe URL parsing without relying on URL constructor
 */

export interface ParsedURL {
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  searchParams: Record<string, string>;
  href: string;
  origin: string;
}

/**
 * Parse a URL string into components without using URL constructor
 */
export function parseURL(urlString: string): ParsedURL {
  try {
    // Try using URL constructor first (if polyfill works)
    const url = new URL(urlString);
    const searchParams: Record<string, string> = {};

    // Parse search params manually to ensure compatibility
    if (url.search) {
      const params = url.search.substring(1).split('&');
      for (const param of params) {
        const [key, value] = param.split('=');
        if (key) {
          searchParams[decodeURIComponent(key)] = decodeURIComponent(
            value || '',
          );
        }
      }
    }

    return {
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      searchParams,
      href: url.href,
      origin: url.origin,
    };
  } catch (error) {
    // Fallback to manual parsing if URL constructor fails
    return parseURLManually(urlString);
  }
}

/**
 * Manual URL parsing fallback
 */
function parseURLManually(urlString: string): ParsedURL {
  const match = urlString.match(
    /^(https?:)\/\/([^\/\?#]+)([^\?#]*)(\?[^#]*)?(#.*)?$/,
  );

  if (!match) {
    throw new Error(`Invalid URL: ${urlString}`);
  }

  const [, protocol, hostname, pathname = '', search = '', hash = ''] = match;

  const searchParams: Record<string, string> = {};
  if (search) {
    const params = search.substring(1).split('&');
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key) {
        searchParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
  }

  const origin = `${protocol}//${hostname}`;

  return {
    protocol,
    hostname,
    pathname,
    search,
    searchParams,
    href: urlString,
    origin,
  };
}

/**
 * Get a search parameter from a URL string
 */
export function getURLParameter(
  urlString: string,
  paramName: string,
): string | null {
  const parsed = parseURL(urlString);
  return parsed.searchParams[paramName] || null;
}

/**
 * Join URL parts safely
 */
export function joinURL(base: string, ...parts: string[]): string {
  const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
  const joinedParts = parts
    .map(part => part.replace(/^\/+|\/+$/g, ''))
    .filter(part => part.length > 0)
    .join('/');

  return joinedParts ? `${baseUrl}/${joinedParts}` : baseUrl;
}

/**
 * Create a full URL from a relative URL and base
 */
export function resolveURL(relative: string, base: string): string {
  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    return relative;
  }

  const baseUrl = parseURL(base);

  if (relative.startsWith('/')) {
    return `${baseUrl.origin}${relative}`;
  }

  return joinURL(baseUrl.origin, baseUrl.pathname, relative);
}
