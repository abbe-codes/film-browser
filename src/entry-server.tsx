import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { CacheProvider } from './state/cache';
import { fetchFilms, fetchFilmDetails } from './api/films';
import { InitialDataProvider } from './ssr/initialData';
import type { InitialData } from './ssr/initialData.types';

function extractFilmId(url: string): string | null {
  const pathname = url.split('?')[0].split('#')[0];
  const m = pathname.match(/^\/film\/([^/]+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function render(url: string) {
  const initialData: InitialData = {};

  // Home SSR data
  if (url === '/' || url.startsWith('/?')) {
    const result = await fetchFilms();
    if (result.ok) initialData.films = result.data;
  }

  // Film details SSR data
  const filmId = extractFilmId(url);
  if (filmId) {
    const result = await fetchFilmDetails(filmId);
    if (result.ok) initialData.filmDetails = result.data;
  }

  const appHtml = renderToString(
    <StaticRouter location={url}>
      <InitialDataProvider value={initialData}>
        <CacheProvider>
          <App />
        </CacheProvider>
      </InitialDataProvider>
    </StaticRouter>,
  );

  return { appHtml, initialData };
}
