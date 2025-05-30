import dedent from 'dedent';
import OpenAI from 'openai';

import {PlaceInfo, PlaceType, PostResponse} from './types';

const PROMPT_PRELUDE = `
You are a helpful instagram places assistant. You are given various pieces of
information from an Insstagram Reel or Post. Your job is to determine
information about the restaurants or places mentioned and prduce a short and
sweet summary suitable as the note for a saved place in google maps.

If the transcription apperas to be completely unrelated based on the caption,
assume it is background music with vocals and ignore it!
`.trim();

const PLACE_TYPES = [
  'restaurant',
  'cafe',
  'bar',
  'gallery',
  'museum',
  'store',
  'market',
  'park',
  'viewpoint',
  'landmark',
  'hotel',
  'spa',
  'studio',
  'exhibit',
] satisfies PlaceType[];

const PLACE_PROPERTIES = {
  name: {
    type: 'string',
    description: 'The name of the place or restaurant',
  },
  address: {
    type: ['string', 'null'],
    description: 'The full or partial address of the place, or null if unknown',
  },
  placeType: {
    type: 'string',
    description: 'The category of place',
    enum: PLACE_TYPES,
  },
  whatsGood: {
    type: 'string',
    description: 'A brief list of recommended items to order or things to see or do',
  },
  vibe: {
    type: 'string',
    description:
      'A short description of the vibe or atmosphere (e.g., cozy, lively, good for dates)',
  },
  emoji: {
    type: 'string',
    description: 'A single emoji representing the place',
  },
} as const satisfies Record<keyof PlaceInfo, any>;

const OUTPUT_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'PlaceRecommendationContainer',
  type: 'object',
  required: ['places'],
  properties: {
    places: {
      type: 'array',
      description: 'A list of recommended places or restaurants',
      items: {
        type: 'object',
        required: Object.keys(PLACE_PROPERTIES),
        properties: PLACE_PROPERTIES,
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

export async function queryResponse(
  openai: OpenAI,
  transcription: OpenAI.Audio.Transcriptions.Transcription,
  instagramInfo: any
) {
  const placeDetails = dedent`
  **POST LOCATION**: ${instagramInfo.location ?? '<Unknown>'}

  **CAPTION**:

  ${instagramInfo.caption}

  **VIDEO TRANSCRIPTION**:

  ${transcription.text}`.trim();

  const response = await openai.responses.create({
    model: 'o4-mini',
    input: [
      {
        role: 'system',
        content: [{type: 'input_text', text: PROMPT_PRELUDE}],
      },
      {
        role: 'user',
        content: [{type: 'input_text', text: placeDetails}],
      },
    ],

    text: {
      format: {name: 'items', type: 'json_schema', schema: OUTPUT_SCHEMA},
    },
  });

  return JSON.parse(response.output_text) as PostResponse;
}
