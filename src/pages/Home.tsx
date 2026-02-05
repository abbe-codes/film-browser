import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';
import { useCache } from '../state/cache';
import { fetchFilmsByCategory } from '../api/films';
import type { Film } from '../types/film';

type Categories = {
  popular?: Film[];
  top_rated?: Film[];
  upcoming?: Film[];
};

function Carousel({ title, films }: { title: string; films: Film[] }) {
  return (
    <section>
      <h2>{title}</h2>
      {!films.length ? (
        <p>No movies available.</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
          {films.map((movie) => (
            <div key={movie.id} style={{ minWidth: 160 }}>
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
              ) : null}

              <Link to={`/film/${movie.id}`}>{movie.title}</Link>
              {movie.year ? <div>{movie.year}</div> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function Home() {
  const { categories: ssrCategories } = useInitialData();
  const { state, setCategories } = useCache();

  const cachedCategories = state.categories;

  const initialCategories: Categories | undefined =
    ssrCategories ?? (cachedCategories ? { ...cachedCategories } : undefined);

  const [categories, setCategoriesLocal] = useState<Categories | undefined>(
    initialCategories,
  );

  const [loading, setLoading] = useState(!initialCategories);
  const [error, setError] = useState<string | null>(null);

  const popular = useMemo(() => categories?.popular ?? [], [categories]);
  const topRated = useMemo(() => categories?.top_rated ?? [], [categories]);
  const upcoming = useMemo(() => categories?.upcoming ?? [], [categories]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Prefer SSR snapshot
      if (
        ssrCategories?.popular &&
        ssrCategories.top_rated &&
        ssrCategories.upcoming
      ) {
        setCategories(ssrCategories); // seed cache
        setCategoriesLocal(ssrCategories);
        setLoading(false);
        setError(null);
        return;
      }

      // Then cache
      if (
        cachedCategories?.popular &&
        cachedCategories.top_rated &&
        cachedCategories.upcoming
      ) {
        setCategoriesLocal(cachedCategories);
        setLoading(false);
        setError(null);
        return;
      }

      // Otherwise fetch on client
      setLoading(true);
      setError(null);

      const [p, t, u] = await Promise.all([
        fetchFilmsByCategory('popular'),
        fetchFilmsByCategory('top_rated'),
        fetchFilmsByCategory('upcoming'),
      ]);

      if (cancelled) return;

      if (!p.ok) return (setError(p.message), setLoading(false));
      if (!t.ok) return (setError(t.message), setLoading(false));
      if (!u.ok) return (setError(u.message), setLoading(false));

      const next: Categories = {
        popular: p.data,
        top_rated: t.data,
        upcoming: u.data,
      };

      setCategories(next); // store in cache
      setCategoriesLocal(next);
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [ssrCategories, cachedCategories, setCategories]);

  return (
    <main>
      <h1>Home</h1>
      <p>
        <Link to='/wishlist'>Go to Wishlist</Link>
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Failed to load movies: {error}</p>
      ) : (
        <>
          <Carousel title='Popular Movies' films={popular} />
          <Carousel title='Top Rated Movies' films={topRated} />
          <Carousel title='Upcoming Movies' films={upcoming} />
        </>
      )}
    </main>
  );
}
