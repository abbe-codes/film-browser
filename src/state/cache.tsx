/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Film, FilmDetails } from '../types/film';

type CategoriesCache = {
  popular?: Film[];
  top_rated?: Film[];
  upcoming?: Film[];
};

type CacheState = {
  categories?: CategoriesCache;
  filmDetailsById: Record<string, FilmDetails | undefined>;
};

type CacheApi = {
  state: CacheState;
  setCategories: (categories: CategoriesCache) => void;
  setFilmDetails: (id: string, details: FilmDetails) => void;
};

const CacheContext = createContext<CacheApi | null>(null);

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategoriesState] = useState<
    CategoriesCache | undefined
  >(undefined);
  const [filmDetailsById, setFilmDetailsById] = useState<
    Record<string, FilmDetails | undefined>
  >({});

  const api = useMemo<CacheApi>(
    () => ({
      state: { categories, filmDetailsById },
      setCategories: (c) => setCategoriesState(c),
      setFilmDetails: (id, details) =>
        setFilmDetailsById((prev) => ({ ...prev, [id]: details })),
    }),
    [categories, filmDetailsById],
  );

  return <CacheContext.Provider value={api}>{children}</CacheContext.Provider>;
}

export function useCache(): CacheApi {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCache must be used within CacheProvider');
  return ctx;
}
