/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Film, FilmDetails } from '../types/film';

type CacheState = {
  films?: Film[];
  filmDetailsById: Record<string, FilmDetails | undefined>;
};

type CacheApi = {
  state: CacheState;
  setFilms: (films: Film[]) => void;
  setFilmDetails: (id: string, details: FilmDetails) => void;
};

const CacheContext = createContext<CacheApi | null>(null);

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const [films, setFilmsState] = useState<Film[] | undefined>(undefined);
  const [filmDetailsById, setFilmDetailsById] = useState<
    Record<string, FilmDetails | undefined>
  >({});

  const api = useMemo<CacheApi>(
    () => ({
      state: { films, filmDetailsById },
      setFilms: (f) => setFilmsState(f),
      setFilmDetails: (id, details) =>
        setFilmDetailsById((prev) => ({ ...prev, [id]: details })),
    }),
    [films, filmDetailsById],
  );

  return <CacheContext.Provider value={api}>{children}</CacheContext.Provider>;
}

export function useCache(): CacheApi {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCache must be used within CacheProvider');
  return ctx;
}
