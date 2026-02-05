import './styles/global.css';
import { AppRoutes } from './routes';

export function App() {
  return (
    <div className='page'>
      <header className='header'>Film Browser (SSR)</header>
      <AppRoutes />
    </div>
  );
}
