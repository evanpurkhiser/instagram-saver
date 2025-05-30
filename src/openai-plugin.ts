import fp from 'fastify-plugin';
import OpenAI from 'openai';

declare module 'fastify' {
  interface FastifyInstance {
    openai: OpenAI;
  }
}

export const openaiPlugin = fp((server, _options, done) => {
  const client = new OpenAI({apiKey: server.config.OPENAI_TOKEN});
  server.decorate('openai', client);
  done();
});
