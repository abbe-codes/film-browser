import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { fetchFilms } from './api/films';
import { InitialDataProvider } from './ssr/initialData';
import type { InitialData } from './ssr/initialData.types';

export async function render(url: string) {
  const initialData: InitialData = {};

  if (url === '/' || url.startsWith('/?')) {
    const result = await fetchFilms();
    if (result.ok) initialData.films = result.data;
  }

  const appHtml = renderToString(
    <StaticRouter location={url}>
      <InitialDataProvider value={initialData}>
        <App />
      </InitialDataProvider>
    </StaticRouter>,
  );

  return { appHtml, initialData };
}
