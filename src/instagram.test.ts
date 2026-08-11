import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {describe, it} from 'node:test';

import {parseInstagramInfo} from './instagram';

function fixture(name: string) {
  return readFile(join(__dirname, 'fixtures', name), 'utf8');
}

describe('parseInstagramInfo', () => {
  it('parses video media', async () => {
    const info = parseInstagramInfo(await fixture('instagram-video.html'), 'DbqWSEoBpPD');

    assert.equal(info.type, 'video');
    assert.equal(info.shortCode, 'DbqWSEoBpPD');
    assert.match(info.caption, /field study coffee/);
    assert.match(info.mediaUrl, /^https:\/\//);
  });

  it('parses carousel media', async () => {
    const info = parseInstagramInfo(
      await fixture('instagram-carousel.html'),
      'DJS2jZXptzr',
    );

    assert.equal(info.type, 'post');
    assert.equal(info.shortCode, 'DJS2jZXptzr');
    assert.match(info.caption, /Tiffany and Rick Johnson/);
    assert.equal(info.imageUrls.length, 6);
    assert.ok(info.imageUrls.every(url => url.startsWith('https://')));
  });

  it('rejects a real Instagram page without media data', async () => {
    const html = await fixture('instagram-missing.html');

    assert.throws(
      () => parseInstagramInfo(html, 'AAAAAAAAAAA'),
      /Instagram media info missing from page/,
    );
  });
});
