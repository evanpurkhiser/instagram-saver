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
  type: 'Place';
  name: string;
  address: string | null;
  placeType: PlaceType;
  whatsGood: string;
  vibe: string;
  emoji: string;
}

export interface EventInfo {
  type: 'Event';
  name: string;
  location: string;
  date: string | null;
  time: string | null;
  description: string;
  emoji: string;
}

export interface RecipeInfo {
  type: 'Recipe';
  name: string;
  ingredients: string[];
  steps: string[];
  cuisine: string;
  emoji: string;
}

export type Recommendation = PlaceInfo | EventInfo | RecipeInfo;

export interface ItemResponse {
  items: Recommendation[];
}
