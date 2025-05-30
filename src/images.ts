import {fetch} from 'undici';

export function fetchImages(imageUrls: string[]) {
  const imageFetches = imageUrls.map(async url => {
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    return Buffer.from(arrayBuffer);
  });

  return Promise.all(imageFetches);
}
