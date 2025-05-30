export interface InstagramInfo {
  caption: string;
  location: string;
  mediaUrl: string;
}

export interface PostResponse {
  places: PlaceInfo[];
}

export interface PlaceInfo {
  name: string;
  address: string;
  whatToGet: string;
  cusineType: string;
  vibe: string;
  emoji: string;
}
