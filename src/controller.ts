import type {FastifyInstance} from 'fastify';

import {fetchgInstagramInfo} from './instagram';
import {queryResponse} from './prompt';
import {extractAudioStream, fetchVideo, transcribeAudio} from './video';

interface Querystring {
  instagramUrl: string;
}

// eslint-disable-next-line require-await
export async function router(server: FastifyInstance) {
  const {log, openai} = server;

  server.get<{Querystring: Querystring}>('/', async (request, response) => {
    const instagramUrl = request.query['instagramUrl'];

    const info = await fetchgInstagramInfo(instagramUrl);
    log.info('Got media info...');

    const videoStream = await fetchVideo(info.mediaUrl);
    log.info('Got video stream...');

    const audioFile = await extractAudioStream(videoStream);
    log.info('Extracted audio stream...');

    const transcription = await transcribeAudio(openai, audioFile);
    log.info(`Got transcription (${transcription.text.split(/\s+/).length} words)`);

    const result = await queryResponse(openai, transcription, info);
    log.info('Got places', result);

    response.send(result.places);
  });
}
