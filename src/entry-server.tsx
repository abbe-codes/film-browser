import { renderToString } from 'react-dom/server';
import { App } from './App';

export function render() {
  const appHtml = renderToString(<App />);
  return { appHtml };
}
