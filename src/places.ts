import {PlacesClient} from '@googlemaps/places';

import {Recommendation} from './types';

export async function fetchGoogleMapsUrl(places: PlacesClient, item: Recommendation) {
  const hasAddress = item.type === 'Place' || item.type === 'Event';

  if (!hasAddress) {
    return null;
  }

  const textQuery =
    item.type === 'Place' ? `${item.name} ${item.address ?? ''}` : item.location;

  const fields = [
    'places.displayName',
    'places.formattedAddress',
    'places.googleMapsUri',
  ];

  const response = await places.searchText(
    {textQuery},
    {
      otherArgs: {
        headers: {'X-Goog-FieldMask': fields.join(',')},
      },
    }
  );

  const results = response[0].places;

  if (!results || results.length === 0) {
    return null;
  }

  return results[0].googleMapsUri ?? null;
}
