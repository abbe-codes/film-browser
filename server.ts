import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 5173;

async function createServer() {
  const app = express();

  if (!isProd) {
    // Dev: Vite in middleware mode (SSR)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use(/.*/, async (req, res) => {
      try {
        const url = req.originalUrl;

        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);

        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
        const { appHtml } = render();

        const html = template.replace('<!--app-html-->', appHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: unknown) {
        const err = e as Error;
        vite.ssrFixStacktrace(err);
        res.status(500).end(err.stack);
      }
    });

    app.listen(port, () =>
      console.log(`SSR dev server: http://localhost:${port}`),
    );
    return;
  }

  // Prod (we’ll do later): serve dist/client + use dist/server entry
  app.use(/.*/, (_req, res) => {
    res.status(501).end('Production SSR not wired yet.');
  });
}

createServer();
