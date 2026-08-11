import * as cheerio from 'cheerio';
import pRetry from 'p-retry';
import {fetch} from 'undici';

import type {InstagramInfo} from './types';

function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9\-_]+)/);
  return match ? match[2] : null;
}

function findMediaDeep(obj: any): Record<string, any> | null {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  if ('caption' in obj && ('video_versions' in obj || 'carousel_media' in obj)) {
    return obj;
  }

  for (const key in obj) {
    const value = obj[key];
    const result = findMediaDeep(value);
    if (result !== null) {
      return result;
    }
  }

  return null;
}

// Not sure how many of these are required, but definitely at least SOME are
// for it to come back with the json blob as a script tag
const headers = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Chromium";v="145", "Not:A-Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/145.0.0.0 Safari/537.36',
};

async function fetchPageHtml(url: string) {
  const response = await fetch(url, {headers});

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram post: ${response.status}`);
  }

  return response.text();
}

export function parseInstagramInfo(html: string, shortCode: string): InstagramInfo {
  const $ = cheerio.load(html);

  const mediaItems = $('script[type="application/json"]')
    .map((_, el) => $(el).html())
    .get()
    .map(json => findMediaDeep(JSON.parse(json)))
    .filter((data): data is Record<string, any> => data !== null);

  const item = mediaItems[0];
  if (item === undefined) {
    throw new Error('Instagram media info missing from page');
  }

  const caption: string = item.caption.text;
  const location: string = item.location?.name;

  const common = {
    caption,
    location,
    shortCode,
  };

  if (item.video_versions) {
    const mediaUrl: string = item.video_versions[0].url;

    return {type: 'video', mediaUrl, ...common};
  }

  if (item.carousel_media) {
    const imageUrls = item.carousel_media.map((media: any) => media.display_uri);

    return {type: 'post', imageUrls, ...common};
  }

  throw new Error('Unknown media type');
}

async function doFetch(postUrl: string) {
  const shortCode = extractInstagramShortcode(postUrl);

  if (shortCode === null) {
    throw new Error('Missing short code');
  }

  const url = `https://www.instagram.com/p/${shortCode}/`;
  return parseInstagramInfo(await fetchPageHtml(url), shortCode);
}

export function fetchgInstagramInfo(postUrl: string) {
  return pRetry(() => doFetch(postUrl), {retries: 3, shouldRetry: () => true});
}
