import { httpGetJson, type HttpResult } from './http';
import type { Film, FilmDetails } from '../types/film';

const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

function withKey(url: string) {
  return `${url}?api_key=${API_KEY}`;
}

type TmdbPopularResponse = {
  results: Array<{
    id: number;
    title: string;
    release_date?: string;
    poster_path?: string | null;
  }>;
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  overview?: string | null;
  release_date?: string;
  poster_path?: string | null;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
};

function yearFromReleaseDate(releaseDate?: string) {
  if (!releaseDate || releaseDate.length < 4) return undefined;
  const y = Number(releaseDate.slice(0, 4));
  return Number.isFinite(y) ? y : undefined;
}

// TMDB image base (simple default; can be made dynamic later)
function posterUrl(posterPath?: string | null) {
  return posterPath
    ? `https://image.tmdb.org/t/p/w342${posterPath}`
    : undefined;
}

export async function fetchFilms(): Promise<HttpResult<Film[]>> {
  const res = await httpGetJson<TmdbPopularResponse>(
    withKey(`${API_BASE}/movie/popular`),
  );
  if (!res.ok) return res;

  const films: Film[] = res.data.results.map((m) => ({
    id: String(m.id),
    title: m.title,
    year: yearFromReleaseDate(m.release_date),
    posterUrl: posterUrl(m.poster_path),
  }));

  return { ok: true, data: films };
}

export async function fetchFilmDetails(
  id: string,
): Promise<HttpResult<FilmDetails>> {
  const res = await httpGetJson<TmdbMovieDetails>(
    withKey(`${API_BASE}/movie/${encodeURIComponent(id)}`),
  );
  if (!res.ok) return res;

  const d = res.data;

  const details: FilmDetails = {
    id: String(d.id),
    title: d.title,
    description: d.overview ?? undefined,
    year: yearFromReleaseDate(d.release_date),
    posterUrl: posterUrl(d.poster_path),
    rating: typeof d.vote_average === 'number' ? d.vote_average : undefined,
    genres: d.genres?.map((g) => g.name) ?? undefined,
  };

  return { ok: true, data: details };
}
