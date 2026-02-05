import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';
import { fetchFilms } from '../api/films';
import type { Film } from '../types/film';
import { useCache } from '../state/cache';

export function Home() {
  const { films: ssrFilms } = useInitialData();
  const { state, setFilms } = useCache();

  const cachedFilms = state.films;

  const [films, setFilmsLocal] = useState<Film[] | null>(
    ssrFilms?.length ? ssrFilms : (cachedFilms ?? null),
  );
  const [loading, setLoading] = useState(
    !(ssrFilms?.length || cachedFilms?.length),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Prefer SSR snapshot
      if (ssrFilms?.length) {
        setFilms(ssrFilms); // seed cache
        setFilmsLocal(ssrFilms);
        setLoading(false);
        setError(null);
        return;
      }

      // Then cache
      if (cachedFilms?.length) {
        setFilmsLocal(cachedFilms);
        setLoading(false);
        setError(null);
        return;
      }

      // Otherwise fetch
      setLoading(true);
      setError(null);

      const res = await fetchFilms();
      if (cancelled) return;

      if (res.ok) {
        setFilms(res.data); // store in cache
        setFilmsLocal(res.data);
        setLoading(false);
      } else {
        setFilmsLocal(null);
        setLoading(false);
        setError(res.message);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [ssrFilms, cachedFilms, setFilms]);

  return (
    <main>
      <h1>Home</h1>
      <p>
        <Link to='/wishlist'>Go to Wishlist</Link>
      </p>

      {loading ? (
        <p>Loading films...</p>
      ) : error ? (
        <p>Failed to load films: {error}</p>
      ) : films?.length ? (
        <ul>
          {films.map((f) => (
            <li key={f.id}>
              <Link to={`/film/${f.id}`}>{f.title}</Link>
              {f.year ? ` (${f.year})` : null}
            </li>
          ))}
        </ul>
      ) : (
        <p>No films found.</p>
      )}
    </main>
  );
}
