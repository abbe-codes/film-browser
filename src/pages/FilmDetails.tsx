import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';
import { fetchFilmDetails } from '../api/films';
import type { FilmDetails as FilmDetailsType } from '../types/film';
import { useCache } from '../state/cache';

export function FilmDetails() {
  const { id } = useParams();
  const { filmDetails: ssrDetails } = useInitialData();
  const { state, setFilmDetails } = useCache();

  const cached = id ? state.filmDetailsById[String(id)] : undefined;

  const ssrMatches = useMemo(
    () => ssrDetails && id && String(ssrDetails.id) === String(id),
    [ssrDetails, id],
  );

  const initial = ssrMatches ? ssrDetails! : (cached ?? null);

  const [details, setDetails] = useState<FilmDetailsType | null>(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!id) return;

      // Prefer SSR snapshot for this id
      if (ssrMatches) {
        setFilmDetails(String(id), ssrDetails!); // seed cache
        setDetails(ssrDetails!);
        setLoading(false);
        setError(null);
        return;
      }

      // Then cache
      if (cached) {
        setDetails(cached);
        setLoading(false);
        setError(null);
        return;
      }

      // Otherwise fetch
      setLoading(true);
      setError(null);

      const res = await fetchFilmDetails(String(id));
      if (cancelled) return;

      if (res.ok) {
        setFilmDetails(String(id), res.data); // store in cache
        setDetails(res.data);
        setLoading(false);
      } else {
        setDetails(null);
        setLoading(false);
        setError(res.message);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id, ssrMatches, ssrDetails, cached, setFilmDetails]);

  return (
    <main>
      <p>
        <Link to='/'>Back to Home</Link>
      </p>
      <h1>Film Details</h1>

      {loading ? (
        <p>Loading film details...</p>
      ) : error ? (
        <p>Failed to load film details: {error}</p>
      ) : details ? (
        <>
          {details.posterUrl ? (
            <img
              src={details.posterUrl}
              alt={`${details.title} poster`}
              style={{ maxWidth: '200px', marginBottom: '1rem' }}
            />
          ) : null}

          <h2>{details.title}</h2>

          {details.description ? <p>{details.description}</p> : null}

          {details.genres?.length ? (
            <p>Genres: {details.genres.join(', ')}</p>
          ) : null}

          {typeof details.rating === 'number' ? (
            <p>Rating: {details.rating.toFixed(1)}</p>
          ) : null}
        </>
      ) : (
        <p>Film not found.</p>
      )}
    </main>
  );
}
