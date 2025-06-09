import {EventInfo, PlaceInfo, PlaceType, RecipeInfo} from './types';

const PLACE_TYPES = [
  'Restaurant',
  'Cafe',
  'Bar',
  'Gallery',
  'Museum',
  'Store',
  'Outdoors',
  'Experience',
  'Other',
] satisfies PlaceType[];

const PLACE_PROPERTIES = {
  type: {
    type: 'string',
    const: 'Place',
    description: 'The type discriminator for a place object',
  },
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

const EVENT_PROPERTIES = {
  type: {
    type: 'string',
    const: 'Event',
    description: 'The type discriminator for an event object',
  },
  name: {
    type: 'string',
    description: 'The name of the event',
  },
  location: {
    type: 'string',
    description: 'Where the event is taking place (city, venue, etc.)',
  },
  date: {
    type: ['string', 'null'],
    format: 'date',
    description:
      'The date of the event in ISO format (e.g., 2025-06-14), or null if unknown',
  },
  time: {
    type: ['string', 'null'],
    description: 'The time of the event (e.g., "7:30 PM"), or null if unknown',
  },
  description: {
    type: 'string',
    description: 'A short blurb about what the event is and why it’s interesting',
  },
  emoji: {
    type: 'string',
    description: 'A single emoji representing the event',
  },
} as const satisfies Record<keyof EventInfo, any>;

const RECIPE_PROPERTIES = {
  type: {
    type: 'string',
    const: 'Recipe',
    description: 'The type discriminator for a recipe object',
  },
  name: {
    type: 'string',
    description: 'The name of the recipe or dish',
  },
  ingredients: {
    type: 'array',
    description: 'A list of ingredients needed to make the recipe',
    items: {type: 'string'},
  },
  steps: {
    type: 'array',
    description: 'Step-by-step instructions to make the recipe',
    items: {type: 'string'},
  },
  cuisine: {
    type: 'string',
    description: 'The general cuisine of the recipe (e.g., Thai, Italian)',
  },
  emoji: {
    type: 'string',
    description: 'A single emoji representing the dish',
  },
} as const satisfies Record<keyof RecipeInfo, any>;

export const OUTPUT_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'RecommendationContainer',
  type: 'object',
  required: ['items'],
  properties: {
    items: {
      type: 'array',
      description: 'A list of extracted items from the reel',
      items: {
        anyOf: [
          {
            type: 'object',
            required: Object.keys(PLACE_PROPERTIES),
            properties: PLACE_PROPERTIES,
            additionalProperties: false,
          },
          {
            type: 'object',
            required: Object.keys(EVENT_PROPERTIES),
            properties: EVENT_PROPERTIES,
            additionalProperties: false,
          },
          {
            type: 'object',
            required: Object.keys(RECIPE_PROPERTIES),
            properties: RECIPE_PROPERTIES,
            additionalProperties: false,
          },
        ],
        discriminator: {
          propertyName: 'type',
          mapping: {
            place: '#/definitions/place',
            recipe: '#/definitions/recipe',
            event: '#/definitions/event',
            itinerary: '#/definitions/itinerary',
          },
        },
      },
    },
  },
  additionalProperties: false,
};
