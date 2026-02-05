/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Film, FilmDetails } from '../types/film';

type CategoriesCache = {
  popular?: Film[];
  top_rated?: Film[];
  upcoming?: Film[];
};

type CacheState = {
  films?: Film[];
  categories?: CategoriesCache;
  filmDetailsById: Record<string, FilmDetails | undefined>;
};

type CacheApi = {
  state: CacheState;
  setFilms: (films: Film[]) => void;
  setCategories: (categories: CategoriesCache) => void;
  setFilmDetails: (id: string, details: FilmDetails) => void;
};

const CacheContext = createContext<CacheApi | null>(null);

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const [films, setFilmsState] = useState<Film[] | undefined>(undefined);
  const [categories, setCategoriesState] = useState<
    CategoriesCache | undefined
  >(undefined);
  const [filmDetailsById, setFilmDetailsById] = useState<
    Record<string, FilmDetails | undefined>
  >({});

  const api = useMemo<CacheApi>(
    () => ({
      state: { films, categories, filmDetailsById },
      setFilms: (f) => setFilmsState(f),
      setCategories: (c) => setCategoriesState(c),
      setFilmDetails: (id, details) =>
        setFilmDetailsById((prev) => ({ ...prev, [id]: details })),
    }),
    [films, categories, filmDetailsById],
  );

  return <CacheContext.Provider value={api}>{children}</CacheContext.Provider>;
}

export function useCache(): CacheApi {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCache must be used within CacheProvider');
  return ctx;
}
