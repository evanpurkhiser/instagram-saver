import type {FastifyInstance} from 'fastify';

import {fetchImages} from './images';
import {fetchgInstagramInfo} from './instagram';
import {fetchGoogleMapsUrl} from './places';
import {queryResponse} from './prompt';
import {InstagramInfo} from './types';
import {extractAudioStream, fetchVideo, transcribeAudio} from './video';

interface Params {
  ['*']: string;
}

// eslint-disable-next-line require-await
export async function router(server: FastifyInstance) {
  const {log, openai} = server;

  async function getResult(info: InstagramInfo) {
    if (info.type === 'video') {
      log.info('Detected video');
      log.info('Getting video stream...');
      const videoStream = await fetchVideo(info.mediaUrl);

      log.info('Extracting audio stream...');
      const audioFile = await extractAudioStream(videoStream);

      log.info('Getting transcription...');
      const transcription = await transcribeAudio(openai, audioFile);
      log.info(`Got transcription (${transcription.text.split(/\s+/).length} words)`);

      log.info('Extracting places...');
      return queryResponse(openai, transcription.text, [], info);
    }

    if (info.type === 'post') {
      log.info('Detected post');
      log.info('Getting all photos...');
      const images = await fetchImages(info.imageUrls);

      log.info('Extracting places...');
      return queryResponse(openai, '[no transcription, see photos]', images, info);
    }

    throw new Error('unknown InstagramInfo type');
  }

  server.get<{Params: Params}>('/i/*', async (request, response) => {
    const instagramUrl = request.params['*'];

    log.info('Getting media info...');
    const info = await fetchgInstagramInfo(instagramUrl);
    const result = await getResult(info);

    log.info('Fetching Google Maps URLs...');
    const mapsUrls = await Promise.all(
      result.places.map(place => fetchGoogleMapsUrl(server.places, place))
    );

    const json = result.places.map((place, i) => ({
      ...place,
      googleMapsUrl: mapsUrls[i],
      instagramUrl: `https://instagram.com/p/${info.shortCode}`,
    }));

    response.send(json);
  });
}
