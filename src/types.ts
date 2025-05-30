export interface InstagramInfo {
  caption: string;
  location: string;
  mediaUrl: string;
}

export interface PostResponse {
  places: PlaceInfo[];
}

export type PlaceType =
  | 'Restaurant'
  | 'Cafe'
  | 'Bar'
  | 'Gallery'
  | 'Museum'
  | 'Store'
  | 'Outdoors'
  | 'Experience'
  | 'Other';

export interface PlaceInfo {
  name: string;
  address: string | null;
  placeType: PlaceType;
  whatsGood: string;
  vibe: string;
  emoji: string;
}
