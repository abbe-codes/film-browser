import { Link, useParams } from 'react-router-dom';

export function FilmDetails() {
  const { id } = useParams();

  return (
    <main>
      <h1>Film Details</h1>
      <p>Film id: {id}</p>

      <p>
        <Link to='/'>Back to Home</Link>
      </p>
    </main>
  );
}
