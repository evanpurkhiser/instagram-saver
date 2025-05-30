import {PlacesClient} from '@googlemaps/places';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    places: PlacesClient;
  }
}

export const googlePlacesPlugin = fp((server, _options, done) => {
  const client = new PlacesClient({apiKey: server.config.GOOGLE_PLACES_API_KEY});
  server.decorate('places', client);
  done();
});
