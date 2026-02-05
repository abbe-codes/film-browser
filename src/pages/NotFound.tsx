import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to='/'>Go home</Link>
    </main>
  );
}
