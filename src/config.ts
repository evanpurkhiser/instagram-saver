import env from '@fastify/env';
import {JSONSchemaType} from 'env-schema';
import fp from 'fastify-plugin';

interface EnvConfig {
  PORT: number;
  OPENAI_TOKEN: string;
}

const schema: JSONSchemaType<EnvConfig> = {
  type: 'object',
  required: ['PORT', 'OPENAI_TOKEN'],
  properties: {
    PORT: {
      type: 'number',
      default: 3006,
    },
    OPENAI_TOKEN: {
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
