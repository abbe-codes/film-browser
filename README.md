# Film Browser (SSR)

A server-side rendered React application built with **Vite**, **TypeScript**, and **Express**.  
This project demonstrates a modern **SSR + hydration** setup without using Next.js.

---

## Tech Stack

- **React 18**
- **Vite** (middleware mode for SSR)
- **TypeScript**
- **Express** (Node.js server)
- **Plain CSS** (no CSS modules, no Tailwind)

---

## Features (current)

- Server-side rendering using `renderToString`
- Client-side hydration using `hydrateRoot`
- Shared React app between server and client
- Development SSR via Vite middleware
- Clean ESM-based Node setup

> ⚠️ Routing, data fetching, and business logic will be added incrementally.

---

## Project Structure

```text
film-browser/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ styles/
│  │  └─ global.css
│  ├─ App.tsx
│  ├─ entry-client.tsx
│  └─ entry-server.tsx
├─ index.html
├─ server.ts
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```
