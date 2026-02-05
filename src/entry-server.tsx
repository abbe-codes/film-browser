import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { App } from './App';
import { routePaths } from './routes.config';

function isKnownRoute(url: string) {
  const pathname = url.split('?')[0].split('#')[0];
  return routePaths.some((pattern) =>
    matchPath({ path: pattern, end: true }, pathname),
  );
}

export function render(url: string) {
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  const status = isKnownRoute(url) ? 200 : 404;
  return { appHtml, status };
}
