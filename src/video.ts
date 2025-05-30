import ffmpeg from 'fluent-ffmpeg';
import OpenAI from 'openai';
import {fetch} from 'undici';

import {PassThrough, Readable} from 'stream';

export async function fetchVideo(mediaUrl: string) {
  const videoRes = await fetch(mediaUrl);
  if (!videoRes.ok) {
    throw new Error(`Failed to fetch video: ${videoRes.statusText}`);
  }
  if (videoRes.body === null) {
    throw new Error('No video body');
  }

  return Readable.from(videoRes.body);
}

export async function extractAudioStream(videoStream: Readable) {
  const audioStream = new PassThrough();

  ffmpeg(videoStream)
    .noVideo()
    .format('mp3')
    .on('error', err => {
      console.error('FFmpeg stream error:', err);
      audioStream.destroy(err);
    })
    .pipe(audioStream, {end: true});

  const audioBuffers: Buffer[] = [];

  for await (const chunk of audioStream) {
    audioBuffers.push(chunk as Buffer);
  }

  const fullBuffer = Buffer.concat(audioBuffers);
  return new File([fullBuffer], 'audio.mp3', {type: 'audio/mpeg'});
}

export function transcribeAudio(openai: OpenAI, file: File) {
  return openai.audio.transcriptions.create({
    file,
    model: 'gpt-4o-transcribe',
    response_format: 'json',
  });
}
