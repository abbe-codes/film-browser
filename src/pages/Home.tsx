import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p>Film list will go here.</p>

      <nav>
        <ul>
          <li>
            <Link to='/film/123'>Go to Film 123</Link>
          </li>
          <li>
            <Link to='/wishlist'>Go to Wishlist</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
