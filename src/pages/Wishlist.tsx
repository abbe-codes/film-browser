import { Link } from 'react-router-dom';
import { useWishlist } from '../state/wishlist';
import { useCache } from '../state/cache';

export function Wishlist() {
  const { ids, remove } = useWishlist();
  const { state } = useCache();

  return (
    <main>
      <p>
        <Link to='/'>Back to Home</Link>
      </p>
      <h1>Wishlist</h1>

      {!ids.length ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {ids.map((id) => {
            const details = state.filmDetailsById[id];
            const title = details?.title ?? `Film ${id}`;

            return (
              <li key={id}>
                <Link to={`/film/${id}`}>{title}</Link>{' '}
                <button type='button' onClick={() => remove(id)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
