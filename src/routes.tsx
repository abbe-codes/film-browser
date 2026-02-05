import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { FilmDetails } from './pages/FilmDetails';
import { Wishlist } from './pages/Wishlist';
import { NotFound } from './pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/film/:id' element={<FilmDetails />} />
      <Route path='/wishlist' element={<Wishlist />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
