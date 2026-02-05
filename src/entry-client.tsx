import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { CacheProvider } from './state/cache';
import { WishlistProvider } from './state/wishlist';
import { InitialDataProvider } from './ssr/initialData';
import type { InitialData } from './ssr/initialData.types';

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

const initialData: InitialData = window.__INITIAL_DATA__ ?? {};

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter>
    <InitialDataProvider value={initialData}>
      <CacheProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CacheProvider>
    </InitialDataProvider>
  </BrowserRouter>,
);
