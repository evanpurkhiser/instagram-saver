interface CommonInfo {
  shortCode: string;
  caption: string;
  location: string;
}

interface InstagramReel extends CommonInfo {
  type: 'video';
  mediaUrl: string;
}

interface InstagramPosts extends CommonInfo {
  type: 'post';
  imageUrls: string[];
}

export type InstagramInfo = InstagramReel | InstagramPosts;

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
