import {PlacesClient} from '@googlemaps/places';

import {PlaceInfo} from './types';

export async function fetchGoogleMapsUrl(places: PlacesClient, place: PlaceInfo) {
  const textQuery = `${place.name} ${place.address ?? ''}`;

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
