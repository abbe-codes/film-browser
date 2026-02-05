import { Link } from 'react-router-dom';
import { useInitialData } from '../ssr/initialData';

export function Home() {
  const { films } = useInitialData();

  return (
    <main>
      <h1>Home</h1>

      {!films?.length ? (
        <p>Loading films (SSR data not available yet)...</p>
      ) : (
        <ul>
          {films.map((f) => (
            <li key={f.id}>
              <Link to={`/film/${f.id}`}>{f.title}</Link>
              {f.year ? ` (${f.year})` : null}
            </li>
          ))}
        </ul>
      )}

      <p>
        <Link to='/wishlist'>Go to Wishlist</Link>
      </p>
    </main>
  );
}
