import type { Film, FilmDetails } from '../types/film';

export type InitialData = {
  films?: Film[];
  filmDetails?: FilmDetails;
  categories?: {
    popular?: Film[];
    top_rated?: Film[];
    upcoming?: Film[];
  };
};
