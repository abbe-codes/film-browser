export type Film = {
  id: string;
  title: string;
  year?: number;
  posterUrl?: string;
};

export type FilmDetails = Film & {
  description?: string;
  genres?: string[];
  rating?: number;
};

export type WishlistItem = {
  filmId: string;
  addedAt: string; // ISO date string
};
