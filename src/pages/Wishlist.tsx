import { Link } from 'react-router-dom';

export function Wishlist() {
  return (
    <main>
      <h1>Wishlist</h1>
      <p>Wishlist items will go here.</p>

      <p>
        <Link to='/'>Back to Home</Link>
      </p>
    </main>
  );
}
