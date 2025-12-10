import { Album, CreateAlbumInput, UpdateAlbumInput } from '../models/album';

// In-memory data store - resets on server restart
let albums: Album[] = [
  {
    id: 1,
    title: "You, Me and an App Id",
    artist: "Daprize",
    price: 10.99,
    image_url: "https://aka.ms/albums-daprlogo"
  },
  {
    id: 2,
    title: "Seven Revision Army",
    artist: "The Blue-Green Stripes",
    price: 13.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  },
  {
    id: 3,
    title: "Scale It Up",
    artist: "KEDA Club",
    price: 13.99,
    image_url: "https://aka.ms/albums-kedalogo"
  },
  {
    id: 4,
    title: "Lost in Translation",
    artist: "MegaDNS",
    price: 12.99,
    image_url: "https://aka.ms/albums-envoylogo"
  },
  {
    id: 5,
    title: "Lock Down Your Love",
    artist: "V is for VNET",
    price: 12.99,
    image_url: "https://aka.ms/albums-vnetlogo"
  },
  {
    id: 6,
    title: "Sweet Container O' Mine",
    artist: "Guns N Probeses",
    price: 14.99,
    image_url: "https://aka.ms/albums-containerappslogo"
  }
];

export const getAllAlbums = (): Album[] => {
  return albums;
};

export const getAlbumById = (id: number): Album | undefined => {
  return albums.find(album => album.id === id);
};

export const createAlbum = (input: CreateAlbumInput): Album => {
  // Auto-increment ID
  const newId = albums.length > 0 
    ? Math.max(...albums.map(a => a.id)) + 1 
    : 1;
  
  const newAlbum: Album = {
    id: newId,
    ...input
  };
  
  albums.push(newAlbum);
  return newAlbum;
};

export const updateAlbum = (id: number, input: UpdateAlbumInput): Album | undefined => {
  const index = albums.findIndex(album => album.id === id);
  
  if (index === -1) {
    return undefined;
  }
  
  albums[index] = {
    ...albums[index],
    ...input
  };
  
  return albums[index];
};

export const deleteAlbum = (id: number): boolean => {
  const index = albums.findIndex(album => album.id === id);
  
  if (index === -1) {
    return false;
  }
  
  albums.splice(index, 1);
  return true;
};

// Helper function for testing - resets data to initial state
export const resetAlbums = (): void => {
  albums = [
    {
      id: 1,
      title: "You, Me and an App Id",
      artist: "Daprize",
      price: 10.99,
      image_url: "https://aka.ms/albums-daprlogo"
    },
    {
      id: 2,
      title: "Seven Revision Army",
      artist: "The Blue-Green Stripes",
      price: 13.99,
      image_url: "https://aka.ms/albums-containerappslogo"
    },
    {
      id: 3,
      title: "Scale It Up",
      artist: "KEDA Club",
      price: 13.99,
      image_url: "https://aka.ms/albums-kedalogo"
    },
    {
      id: 4,
      title: "Lost in Translation",
      artist: "MegaDNS",
      price: 12.99,
      image_url: "https://aka.ms/albums-envoylogo"
    },
    {
      id: 5,
      title: "Lock Down Your Love",
      artist: "V is for VNET",
      price: 12.99,
      image_url: "https://aka.ms/albums-vnetlogo"
    },
    {
      id: 6,
      title: "Sweet Container O' Mine",
      artist: "Guns N Probeses",
      price: 14.99,
      image_url: "https://aka.ms/albums-containerappslogo"
    }
  ];
};
