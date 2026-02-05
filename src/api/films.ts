import { httpGetJson, type HttpResult } from './http';
import type { Film, FilmDetails } from '../types/film';

const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

function withKey(url: string) {
  return `${url}?api_key=${API_KEY}`;
}

export async function fetchFilms(): Promise<HttpResult<Film[]>> {
  return httpGetJson<{ results: Film[] }>(
    withKey(`${API_BASE}/movie/popular`),
  ).then((res) => (res.ok ? { ok: true, data: res.data.results } : res));
}

export async function fetchFilmDetails(
  id: string,
): Promise<HttpResult<FilmDetails>> {
  return httpGetJson<FilmDetails>(
    withKey(`${API_BASE}/movie/${encodeURIComponent(id)}`),
  );
}
