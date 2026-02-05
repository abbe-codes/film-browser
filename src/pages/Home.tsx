import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';
import { fetchFilms } from '../api/films';
import type { Film } from '../types/film';

export function Home() {
  const { films: ssrFilms } = useInitialData();

  const [films, setFilms] = useState<Film[] | null>(ssrFilms ?? null);
  const [loading, setLoading] = useState(!ssrFilms?.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // If we already have SSR films, nothing to do.
      if (ssrFilms?.length) {
        setFilms(ssrFilms);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const res = await fetchFilms();
      if (cancelled) return;

      if (res.ok) {
        setFilms(res.data);
        setLoading(false);
      } else {
        setFilms(null);
        setLoading(false);
        setError(res.message);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [ssrFilms]);

  return (
    <main>
      <h1>Home</h1>

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

      <p>
        <Link to='/wishlist'>Go to Wishlist</Link>
      </p>
    </main>
  );
}
