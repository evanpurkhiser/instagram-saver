import dedent from 'dedent';
import OpenAI from 'openai';

import {OUTPUT_SCHEMA} from './schema';
import {ItemResponse} from './types';

const PROMPT_PRELUDE = `
You are a helpful instagram assistant. You are given various pieces of
information from an Insstagram Reel or Post. Your job is to determine
information about the reel or post and produce structured output matching the
provided schema.

If the transcription apperas to be completely unrelated based on the caption,
assume it is background music with vocals and ignore it!
`.trim();

export async function queryResponse(
  openai: OpenAI,
  transcription: string,
  photos: Buffer[],
  instagramInfo: any
) {
  const details = dedent`
  **POST LOCATION**: ${instagramInfo.location ?? '<Unknown>'}

  **CAPTION**:

  ${instagramInfo.caption}

  **VIDEO TRANSCRIPTION**:

  ${transcription}`.trim();

  const images = photos.map<OpenAI.Responses.ResponseInputImage>(photo => ({
    type: 'input_image',
    image_url: `data:image/jpeg;base64,${photo.toString('base64')}`,
    detail: 'low',
  }));

  const response = await openai.responses.create({
    model: 'o4-mini',
    input: [
      {
        role: 'system',
        content: [{type: 'input_text', text: PROMPT_PRELUDE}],
      },
      {
        role: 'user',
        content: [{type: 'input_text', text: details}, ...images],
      },
    ],

    text: {
      format: {name: 'items', type: 'json_schema', schema: OUTPUT_SCHEMA},
    },
  });

  return JSON.parse(response.output_text) as ItemResponse;
}
