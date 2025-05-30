export interface InstagramInfo {
  caption: string;
  location: string;
  mediaUrl: string;
}

export interface PostResponse {
  places: PlaceInfo[];
}

export type PlaceType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'gallery'
  | 'museum'
  | 'store'
  | 'market'
  | 'park'
  | 'viewpoint'
  | 'landmark'
  | 'hotel'
  | 'spa'
  | 'studio'
  | 'exhibit';

export interface PlaceInfo {
  name: string;
  address: string | null;
  placeType: PlaceType;
  whatsGood: string;
  vibe: string;
  emoji: string;
}
