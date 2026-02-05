import './styles/global.css';

export function App() {
  return (
    <div className='page'>
      <header className='header'>Film Browser (SSR)</header>
      <main className='content'>
        <p>If you see this, SSR + hydration works.</p>
      </main>
    </div>
  );
}
