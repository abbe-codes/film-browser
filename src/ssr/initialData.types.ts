import type { Film, FilmDetails } from '../types/film';

export type InitialData = {
  filmDetails?: FilmDetails;
  categories?: {
    popular?: Film[];
    top_rated?: Film[];
    upcoming?: Film[];
  };
};
