import type {FastifyInstance} from 'fastify';

import {fetchgInstagramInfo} from './instagram';
import {fetchGoogleMapsUrl} from './places';
import {queryResponse} from './prompt';
import {extractAudioStream, fetchVideo, transcribeAudio} from './video';

interface Params {
  ['*']: string;
}

// eslint-disable-next-line require-await
export async function router(server: FastifyInstance) {
  const {log, openai} = server;

  server.get<{Params: Params}>('/i/*', async (request, response) => {
    const instagramUrl = request.params['*'];

    log.info('Getting media info...');
    const info = await fetchgInstagramInfo(instagramUrl);

    log.info('Getting video stream...');
    const videoStream = await fetchVideo(info.mediaUrl);

    log.info('Extracting audio stream...');
    const audioFile = await extractAudioStream(videoStream);

    log.info('Getting transcription...');
    const transcription = await transcribeAudio(openai, audioFile);
    log.info(`Got transcription (${transcription.text.split(/\s+/).length} words)`);

    log.info('Extracting places...');
    const result = await queryResponse(openai, transcription, info);

    log.info('Fetching Google Maps URLs...');
    const mapsUrls = await Promise.all(
      result.places.map(place => fetchGoogleMapsUrl(server.places, place))
    );

    const json = result.places.map((place, i) => ({
      ...place,
      googleMapsUrl: mapsUrls[i],
      instagramUrl,
    }));

    response.send(json);
  });
}
