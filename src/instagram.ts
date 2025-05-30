import * as cheerio from 'cheerio';
import pRetry from 'p-retry';
import {fetch} from 'undici';

import {InstagramInfo} from './types';

function extractInstagramShortcode(url: string): string | null {
  const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9\-_]+)/);
  return match ? match[2] : null;
}

function findKeyDeep(obj: any, targetKey: string): any | null {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  if (targetKey in obj) {
    return obj[targetKey];
  }

  for (const key in obj) {
    const value = obj[key];
    const result = findKeyDeep(value, targetKey);
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
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'max-age=0',
  referer: 'https://www.instagram.com/accounts/onetap/?next=%2F',
  'sec-ch-ua': '"Not.A/Brand";v="99", "Chromium";v="136"',
  'sec-ch-ua-full-version-list':
    '"Not.A/Brand";v="99.0.0.0", "Chromium";v="136.0.7103.114"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-model': '""',
  'sec-ch-ua-platform': '"macOS"',
  'sec-ch-ua-platform-version': '"15.3.2"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'viewport-width': '1232',
};

async function doFetch(postUrl: string) {
  const shortCode = extractInstagramShortcode(postUrl);

  if (shortCode === null) {
    throw new Error('Missing short code');
  }

  const url = `https://instagram.com/p/${shortCode}/`;
  const res = await fetch(url, {headers});

  const html = await res.text();
  const $ = cheerio.load(html);

  const shortcodeInfo = $('script[type="application/json"]')
    .map((_, el) => $(el).html())
    .get()
    .map(json => findKeyDeep(JSON.parse(json), 'xdt_api__v1__media__shortcode__web_info'))
    .filter(data => data !== null);

  if (shortcodeInfo === null) {
    throw new Error('shortcode__web_info missing');
  }

  if (shortcodeInfo[0] === undefined) {
    throw new Error('Shortcode info missing items dictionary');
  }

  const items: Array<Record<string, any>> = shortcodeInfo[0]['items'];

  const data = items.map<InstagramInfo>((item: any) => {
    const caption: string = item.caption.text;
    const location: string = item.location?.name;

    const common = {
      caption,
      location,
      shortCode,
    };

    if ('video_version' in item) {
      const mediaUrl: string = item.video_versions[0].url;

      return {type: 'video', mediaUrl, ...common};
    }

    if ('carousel_media' in item) {
      const imageUrls = item.carousel_media.map((media: any) => media.display_uri);

      return {type: 'post', imageUrls, ...common};
    }

    throw new Error('Unknown media type');
  });

  // XXX: Can there be more than one items?
  return data[0];
}

export function fetchgInstagramInfo(postUrl: string) {
  return pRetry(() => doFetch(postUrl), {retries: 5, shouldRetry: () => true});
}
