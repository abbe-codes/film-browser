import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';
import { fetchFilmDetails } from '../api/films';
import type { FilmDetails as FilmDetailsType } from '../types/film';

export function FilmDetails() {
  const { id } = useParams();
  const { filmDetails } = useInitialData();

  const ssrMatches = useMemo(
    () => filmDetails && String(filmDetails.id) === String(id),
    [filmDetails, id],
  );

  const [details, setDetails] = useState<FilmDetailsType | null>(
    ssrMatches ? filmDetails! : null,
  );
  const [loading, setLoading] = useState(!ssrMatches);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!id) return;

      // If SSR already provided the right film, use it.
      if (ssrMatches) {
        setDetails(filmDetails!);
        setLoading(false);
        setError(null);
        return;
      }

      // Otherwise, fetch on the client (for client-side navigation).
      setLoading(true);
      setError(null);

      const res = await fetchFilmDetails(id);
      if (cancelled) return;

      if (res.ok) {
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
  }, [id, ssrMatches, filmDetails]);

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
