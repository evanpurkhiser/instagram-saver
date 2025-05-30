import {init, setupFastifyErrorHandler} from '@sentry/node';
import {program} from 'commander';
import fastify, {FastifyLoggerOptions} from 'fastify';
import {PinoLoggerOptions} from 'fastify/types/logger';

import {configPlugin} from './config';
import {router} from './controller';
import {openaiPlugin} from './openai-plugin';

init({
  dsn: 'https://50ba4f0897fb12698407b88f62c5cfd9@o126623.ingest.us.sentry.io/4509410186231808',
});

async function boot() {
  const env = process.env.NODE_ENV ?? 'production';

  const loggingConfig: Record<
    string,
    boolean | FastifyLoggerOptions | PinoLoggerOptions
  > = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  };
  const logger = loggingConfig[env];

  const server = fastify({logger});

  await server.register(configPlugin).after();
  await server.register(openaiPlugin).after();

  setupFastifyErrorHandler(server);

  server.register(router);

  program
    .command('server')
    .description('Start the meal-log server')
    .action(async () => {
      await server.listen({host: '0.0.0.0', port: server.config.PORT});
    });

  await program.parseAsync();
}

boot();
