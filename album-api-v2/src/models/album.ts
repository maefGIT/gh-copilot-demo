export interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  image_url: string;
}

export interface CreateAlbumInput {
  title: string;
  artist: string;
  price: number;
  image_url: string;
}

export interface UpdateAlbumInput {
  title?: string;
  artist?: string;
  price?: number;
  image_url?: string;
}
