import env from '@fastify/env';
import {JSONSchemaType} from 'env-schema';
import fp from 'fastify-plugin';

interface EnvConfig {
  PORT: number;
  OPENAI_TOKEN: string;
  GOOGLE_PLACES_API_KEY: string;
}

const schema: JSONSchemaType<EnvConfig> = {
  type: 'object',
  required: ['PORT', 'OPENAI_TOKEN', 'GOOGLE_PLACES_API_KEY'],
  properties: {
    PORT: {
      type: 'number',
      default: 3006,
    },
    OPENAI_TOKEN: {
      type: 'string',
    },
    GOOGLE_PLACES_API_KEY: {
      type: 'string',
    },
  },
} as const;

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
  }
}

export const configPlugin = fp(async server => {
  await server.register(env, {confKey: 'config', schema}).after();
});
